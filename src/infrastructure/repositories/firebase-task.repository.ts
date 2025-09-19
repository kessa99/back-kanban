import { Injectable, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { KanbanColumnEntity } from '../../domain/entities/kanban/kaban.column.entity';
import { ChecklistItemEntity } from '../../domain/entities/kanban/kanban.checkList.entity';
import { KanbanTaskEntity } from '../../domain/entities/kanban/kanban.task.entity';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { Status } from '../../utils/constance/constance.status';

@Injectable()
export class FirebaseTaskRepository implements ITaskRepository {
  private readonly taskCollection = firestore().collection('tasks');
  private readonly columnCollection = firestore().collection('columns');
  private readonly checklistCollection = firestore().collection('checklists');

  // --- Helpers ---
  private mapTask(doc: FirebaseFirestore.DocumentSnapshot): KanbanTaskEntity {
    const data = doc.data();
    if (!data) throw new NotFoundException(`Task data not found for ID ${doc.id}`);
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as KanbanTaskEntity;
  }

  private mapChecklist(doc: FirebaseFirestore.DocumentSnapshot): ChecklistItemEntity {
    const data = doc.data();
    if (!data) throw new NotFoundException(`Checklist data not found for ID ${doc.id}`);
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as ChecklistItemEntity;
  }

  // --- Tasks ---
  async create(task: KanbanTaskEntity): Promise<KanbanTaskEntity> {
    const docRef = await this.taskCollection.add({
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      boardId: task.boardId,
      status: task.status,
      priority: task.priority,
      checklistIds: task.checklistIds ?? [],
      createdBy: task.createdBy,
      createdAt: task.createdAt ?? new Date(),
      updatedAt: task.updatedAt ?? new Date(),
    });
    return { ...task, id: docRef.id };
  }

  async getTasksByBoardId(boardId: string): Promise<KanbanTaskEntity[]> {
    const snapshot = await this.taskCollection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => this.mapTask(doc));
  }

  async findAllByBoardId(boardId: string): Promise<KanbanTaskEntity[]> {
    const snapshot = await this.taskCollection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => this.mapTask(doc));
  }

  async findById(id: string): Promise<KanbanTaskEntity> {
    const doc = await this.taskCollection.doc(id).get();
    if (!doc.exists) throw new NotFoundException(`Task with ID ${id} not found`);
    return this.mapTask(doc);
  }

  async update(task: KanbanTaskEntity): Promise<KanbanTaskEntity> {
    const docRef = this.taskCollection.doc(task.id);
    await docRef.update({
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      boardId: task.boardId,
      status: task.status,
      priority: task.priority,
      checklistIds: task.checklistIds,
      updatedAt: new Date(),
    });
    return task;
  }

  async updateStatusTask(taskId: string, status: Status): Promise<KanbanTaskEntity> {
    const task = await this.findById(taskId);
    task.status = status;
    task.updatedAt = new Date();
    return this.update(task);
  }

  async delete(id: string): Promise<void> {
    const docRef = this.taskCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException(`Task with ID ${id} not found`);
    await docRef.delete();
  }

  async deleteByBoardId(boardId: string): Promise<void> {
    const snapshot = await this.taskCollection.where('boardId', '==', boardId).get();
    if (snapshot.empty) return;
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
  }

  async findAllByAssignedTo(userId: string): Promise<KanbanTaskEntity[]> {
    const snapshot = await this.taskCollection.where('assignTo', 'array-contains', userId).get();
    return snapshot.docs.map(doc => this.mapTask(doc));
  }

  // --- Checklists ---
  async createChecklist(checklist: ChecklistItemEntity, createdBy: string): Promise<ChecklistItemEntity> {
    const docRef = await this.checklistCollection.add({
      title: checklist.title,
      taskId: checklist.taskId,
      createdBy,
      completed: checklist.completed ?? false,
      startDate: checklist.startDate ?? null,
      endDate: checklist.endedAt ?? null,
      createdAt: checklist.createdAt ?? new Date(),
      updatedAt: checklist.updatedAt ?? new Date(),
    });
    return { ...checklist, id: docRef.id };
  }

  async getChecklistById(id: string): Promise<ChecklistItemEntity> {
    const doc = await this.checklistCollection.doc(id).get();
    if (!doc.exists) throw new NotFoundException(`Checklist with ID ${id} not found`);
    return this.mapChecklist(doc);
  }

  // --- Columns ---
  async getColumnsByBoardId(boardId: string): Promise<KanbanColumnEntity[]> {
    const snapshot = await this.columnCollection.where('boardId', '==', boardId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, id: doc.id } as KanbanColumnEntity;
    });
  }
}
