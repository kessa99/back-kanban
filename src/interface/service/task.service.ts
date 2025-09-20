import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { KanbanTaskEntity } from '../../domain/entities/kanban/kanban.task.entity';
import { ChecklistItemEntity } from '../../domain/entities/kanban/kanban.checkList.entity';
import { CreateTaskDto } from '../../utils/dto/task.dto';
import { FirebaseTaskRepository } from '../../infrastructure/repositories/firebase-task.repository';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: FirebaseTaskRepository, // on injecte le repo
    private readonly firestore: admin.firestore.Firestore,   // utile pour certaines vérifs
  ) {}


async createTask(boardId: string, columnId: string, createTaskDto: CreateTaskDto, creatorId: string) {
    try {
      // Vérifier que le board existe
      const boardDoc = await this.firestore.collection('boards').doc(boardId).get();
      if (!boardDoc.exists) throw new NotFoundException('Board non trouvé');
      console.log('----------------------------------------------------------------');
      console.log('Board found:', boardDoc.data());
      console.log('----------------------------------------------------------------');

      // Récupérer l'équipe associée au board
      const boardData = boardDoc.data();
      const teamId = boardData?.teamId;
      if (!teamId) throw new NotFoundException('Aucune équipe associée au board');

      // Valider columnId
      if (!columnId || typeof columnId !== 'string' || columnId.trim() === '') {
        throw new BadRequestException('columnId doit être une chaîne non vide');
      }
      console.log('Validated columnId:', columnId);

      // Vérifier que la colonne existe dans la collection columns pour ce board
      const columnsQuery = await this.firestore
        .collection('columns')
        .where('boardId', '==', boardId)
        .where(admin.firestore.FieldPath.documentId(), '==', columnId)
        .limit(1)
        .get();
      if (columnsQuery.empty) {
        console.log('Column document does not exist for boardId:', boardId);
        throw new NotFoundException(`Colonne ${columnId} non trouvée pour le board ${boardId}`);
      }
      const columnDoc = columnsQuery.docs[0];
      console.log('----------------------------------------------------------------');
      console.log('Column found:', columnDoc.data());
      console.log('----------------------------------------------------------------');

      // Vérifier les membres assignés dans les checklists
      if (createTaskDto.checklist?.length > 0) {
        const teamDoc = await this.firestore.collection('teams').doc(teamId).get();
        if (!teamDoc.exists) throw new NotFoundException('Équipe non trouvée');
        const teamMembers = teamDoc.data()?.members || [];

        for (const item of createTaskDto.checklist) {
          if (item.assignedTo && !teamMembers.includes(item.assignedTo)) {
            throw new BadRequestException(`L'utilisateur ${item.assignedTo} n'est pas membre de l'équipe ${teamId}`);
          }
        }
      }

      // Préparer la checklist si présente
      const checklistEntities: ChecklistItemEntity[] = [];
      if (createTaskDto.checklist?.length > 0) {
        console.log('----------------------------------------------------------------');
        console.log('Processing checklists:', createTaskDto.checklist);
        console.log('----------------------------------------------------------------');
        
        for (const item of createTaskDto.checklist) {
          console.log('----------------------------------------------------------------');
          console.log('Checklist item:', item);
          console.log('assignedTo value:', item.assignedTo);
          console.log('assignedTo type:', typeof item.assignedTo);
          console.log('----------------------------------------------------------------');
          
          checklistEntities.push(
            ChecklistItemEntity.create({
              id: undefined,
              taskId: '',
              title: item.title,
              assignedTo: item.assignedTo || undefined,
              completed: false,
              startDate: item.startDate ? new Date(item.startDate) : undefined,
              endedAt: item.endDate ? new Date(item.endDate) : undefined,
            }),
          );
          console.log('----------------------------------------------------------------');
          console.log('Checklist entity created:', checklistEntities[checklistEntities.length - 1]);
          console.log('----------------------------------------------------------------');
        }
      }

      // Créer l’entité tâche
      const taskEntity = KanbanTaskEntity.create({
        id: undefined,
        columnId,
        boardId,
        title: createTaskDto.title,
        description: createTaskDto.description,
        startDate: createTaskDto.startDate ? new Date(createTaskDto.startDate) : undefined,
        endDate: createTaskDto.endDate ? new Date(createTaskDto.endDate) : undefined,
        status: createTaskDto.status,
        createdBy: creatorId,
        priority: createTaskDto.priority,
        checklistIds: [],
      });

      console.log('----------------------------------------------------------------');
      console.log('Task entity created:', taskEntity);
      console.log('----------------------------------------------------------------');

      // Persister via le repo
      const createdTask = await this.taskRepository.create(taskEntity);

      // Associer et créer les checklists si besoin
      if (checklistEntities.length > 0) {
        const createdChecklists: ChecklistItemEntity[] = [];
        for (const checklist of checklistEntities) {
          checklist.taskId = createdTask.id;
          const created = await this.taskRepository.createChecklist(checklist, creatorId);
          createdChecklists.push(created);
        }
        createdTask.checklistIds = createdChecklists.map(c => c.id);
        await this.taskRepository.update(createdTask);
      }
      console.log('----------------------------------------------------------------');
      console.log('Task with checklists created:', createdTask);
      console.log('----------------------------------------------------------------');

      return {
        status: 'success',
        message: 'Tâche créée avec succès',
        content: createdTask,
      };
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  async findTaskById(taskId: string): Promise<KanbanTaskEntity> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);
    return task;
  }
  
  async addAssignedToChecklist(checklistId: string, assignedTo: string) {
    const checklist = await this.taskRepository.getChecklistById(checklistId);
    if (!checklist) throw new NotFoundException('Checklist non trouvée');

    await this.firestore.collection('checklists').doc(checklistId).update({
      assignedTo,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Envoyer une notification push à l’utilisateur assigné
    await this.sendPushNotification(assignedTo, 'Nouvelle checklist assignée', 'Vous avez été assigné à une checklist');

    return { message: 'Utilisateur assigné avec succès' };
  }

  async removeAssignedToChecklist(checklistId: string) {
    const checklist = await this.taskRepository.getChecklistById(checklistId);
    if (!checklist) throw new NotFoundException('Checklist non trouvée');

    await this.firestore.collection('checklists').doc(checklistId).update({
      assignedTo: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { message: 'Utilisateur retiré avec succès' };
  }

  async sendPushNotification(userId: string, title: string, body: string) {
    const userDoc = await this.firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new NotFoundException('Utilisateur non trouvé');

    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken;

    if (!fcmToken) return; // pas de notif si pas de token

    const message = {
      notification: { title, body },
      token: fcmToken,
    };

    await admin.messaging().send(message);
  }
}
