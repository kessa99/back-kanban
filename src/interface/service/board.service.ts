import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { KanbanBoardEntity } from 'src/domain/entities/kanban/kaban.board.entity';
import { FirebaseBoardRepository } from '../../infrastructure/repositories/firebase-board.repository';
import { TeamService } from './team.service';
import { KanbanColumnEntity } from 'src/domain/entities/kanban/kaban.column.entity';
import { FirebaseColumnRepository } from 'src/infrastructure/repositories/firebase-column.repository'; // À créer
import { FirebaseTaskRepository } from 'src/infrastructure/repositories/firebase-task.repository'; // À créer
import { FirebaseCommentRepository, FirebaseFileRepository } from 'src/infrastructure/repositories/firebase-commentAndFile.repo';
import { ICommentRepository } from 'src/domain/repositories/comment.repository';
import { IFileRepository } from 'src/domain/repositories/file.repository';
import { KanbanTaskEntity } from 'src/domain/entities/kanban/kanban.task.entity';
import { KanbanCommentEntity } from 'src/domain/entities/collaboration/collaboration.comment.entity';
import { CollaborationAttachementEntity } from 'src/domain/entities/collaboration/collaboration.attachement.entity';
import { CollaborationTaskViewEntity } from 'src/domain/entities/collaboration/collaboration.taskView.entity';
import { FirebaseTaskViewRepository } from 'src/infrastructure/repositories/firebase-viewTask.repository';
import { Status } from 'src/utils/constance/constance.status';
import { Priority } from 'src/utils/constance/constance.priority';
import { FirebaseUserRepository } from 'src/infrastructure/repositories/firebase-user.repository';

@Injectable()
export class BoardsService {
  constructor(
    private readonly boardRepository: FirebaseBoardRepository,
    private readonly teamService: TeamService,
    private readonly columnRepository: FirebaseColumnRepository,
    private readonly taskRepository: FirebaseTaskRepository,
    private readonly commentRepository: FirebaseCommentRepository,
    private readonly fileRepository: FirebaseFileRepository,
    private readonly taskViewRepository: FirebaseTaskViewRepository,
    private readonly userRepository: FirebaseUserRepository,
  ) {}

  async findAll(teamId: string, userId: string): Promise<KanbanBoardEntity[]> {
    const team = await this.teamService.findById(teamId, userId);
    if (!team) throw new NotFoundException(`Team with ID ${teamId} not found`);
    const boards = await this.boardRepository.findAllByTeamId(teamId);
    return boards.filter(board => board.teamId === teamId && (board.userId === userId || team.members.includes(userId)));
  }

  async findAllBoardUser(userId: string): Promise<KanbanBoardEntity[]> {
    const boards = await this.boardRepository.findAllBoardUser(userId);
    return boards.filter(board => board.userId === userId);
  }

  async create(teamId: string, userId: string, createData: { name: string; description: string }): Promise<KanbanBoardEntity> {
    const team = await this.teamService.findById(teamId, userId);
    if (!team) throw new NotFoundException(`Team with ID ${teamId} not found`);
    if (team.ownerId !== userId) throw new UnauthorizedException('Only the team owner can create boards');
    
    const board = KanbanBoardEntity.create({
      id: '',
      name: createData.name,
      description: createData.description,
      teamId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const createdBoard = await this.boardRepository.create(board);

    console.log('Board created with ID:', createdBoard.id);

    // Crée des colonnes par défaut avec leurs statuts correspondants
    const defaultColumns = [
      { name: 'Todo', status: Status.PENDING },
      { name: 'In Progress', status: Status.IN_PROGRESS },
      { name: 'Review', status: Status.IN_PROGRESS },
      { name: 'Done', status: Status.COMPLETED },
    ];
    
    console.log('Creating default columns...');
    
    try {
      const columnPromises = defaultColumns.map(col => {
        console.log('Creating column:', col.name, 'with status:', col.status, 'for board:', createdBoard.id);
        return this.columnRepository.create(KanbanColumnEntity.create({
          id: '',
          name: col.name,
          boardId: createdBoard.id,
          status: col.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      });
      
      const createdColumns = await Promise.all(columnPromises);
      console.log('Columns created successfully:', createdColumns.length);
      
      // Ajouter les IDs des colonnes à la réponse
      const columnIds = createdColumns.map(col => col.id);
      
      // Retourner le board avec les IDs des colonnes
      return {
        ...createdBoard,
        columnIds: columnIds
      } as any; // Cast temporaire pour éviter les erreurs de type
      
    } catch (error) {
      console.error('Error creating columns:', error);
      throw error;
    }
  }

  async createTask(boardId: string, userId: string, createData: { 
    title: string; 
    description?: string; 
    columnId: string;
    dueDate?: Date;
    status?: Status;
    assignTo?: string | string[]; // Peut être string ou string[]
    priority?: Priority;
    tagIds?: string[];
    checklistIds?: string[];
    parentTaskId?: string;
  }): Promise<KanbanTaskEntity> {
    console.log('BoardService.createTask called with:', { boardId, userId, createData });
    
    const board = await this.boardRepository.findById(boardId);
    console.log('Board found:', board);
    
    if (!board) throw new NotFoundException(`Board with ID ${boardId} not found`);
    
    const team = await this.teamService.findById(board.teamId, userId);
    console.log('Team found:', team);
    
    if (!team || (team.ownerId !== userId && !team.members.includes(userId))) {
      throw new UnauthorizedException('Access denied: Not a member of this team');
    }
    
    // Normaliser assignTo en tableau d'objets utilisateur
    let assignToArray: { id: string; name: string; email: string }[] = [];
    if (createData.assignTo) {
      const userIds = Array.isArray(createData.assignTo) ? createData.assignTo : [createData.assignTo];
      // Récupérer les détails des utilisateurs
      const userDetails = await this.userRepository.getUsersDetails(userIds);
      assignToArray = userDetails;
    }
    
    // Valider que tous les utilisateurs assignés sont membres de l'équipe
    if (assignToArray.length > 0) {
      const allTeamMembers = [team.ownerId, ...team.members];
      const invalidAssignees = assignToArray.filter(assignee => 
        !allTeamMembers.includes(assignee.id)
      );
      
      if (invalidAssignees.length > 0) {
        throw new UnauthorizedException(`Users ${invalidAssignees.map(a => a.name).join(', ')} are not members of this team`);
      }
    }
    
    console.log('Creating task entity...');
    const task = KanbanTaskEntity.create({
      id: '',
      taskId: '',
      title: createData.title,
      description: createData.description,
      columnId: createData.columnId,
      boardId,
      dueDate: createData.dueDate,
      status: createData.status,
      assignTo: assignToArray.length > 0 ? assignToArray : [{ id: userId, name: '', email: '' }],
      createdBy: userId, // Toujours l'ID de celui qui crée
      priority: createData.priority,
      checklistIds: createData.checklistIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('Task entity created:', task);
    
    const createdTask = await this.taskRepository.create(task);
    console.log('Task created in repository:', createdTask);
    
    return createdTask;
  }

  async getAllTask(boardId: string, userId: string): Promise<KanbanTaskEntity[]> {
    return this.taskRepository.findAllByBoardId(boardId);
  }

  async getAllTaskAssignedTo(boardId: string, userId: string): Promise<KanbanTaskEntity[]> {
    return this.taskRepository.findAllByAssignedTo(boardId);
  }

  async findById(id: string, userId: string): Promise<KanbanBoardEntity> {
    const board = await this.boardRepository.findById(id);
    if (!board) throw new NotFoundException(`Board with ID ${id} not found`);
    const team = await this.teamService.findById(board.teamId, userId);
    if (!team) {
        throw new UnauthorizedException('Access denied: Not a member of this team');
    }
    return board;
  }

  async update(id: string, updates: { name?: string; description?: string }, userId: string): Promise<KanbanBoardEntity> {
    const board = await this.boardRepository.findById(id);
    if (!board) throw new NotFoundException(`Board with ID ${id} not found`);
    const team = await this.teamService.findById(board.teamId, userId);
    if (!team || team.ownerId !== userId) throw new UnauthorizedException('Only the team owner can update this board');
    const updatedBoard = { ...board, ...updates, updatedAt: new Date() };
    return this.boardRepository.update(updatedBoard);
  }

  async updateTaskColumn(taskId: string, newColumnId: string, userId: string): Promise<KanbanTaskEntity> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);
    const board = await this.findById(task.boardId, userId);
    if (!board) throw new UnauthorizedException('Access denied');
    const newColumn = await this.columnRepository.findById(newColumnId);
    if (!newColumn || newColumn.boardId !== task.boardId) {
      throw new NotFoundException(`Column with ID ${newColumnId} not found or not part of this board`);
    }
    
    // Mettre à jour la tâche avec la nouvelle colonne et le statut correspondant
    const updatedTask = { 
      ...task, 
      columnId: newColumnId, 
      status: newColumn.status, // Mise à jour automatique du statut basé sur la colonne
      updatedAt: new Date() 
    };
    
    console.log(`Task ${taskId} moved to column ${newColumnId} with status ${newColumn.status}`);
    return this.taskRepository.update(updatedTask);
  }

  async delete(id: string, userId: string): Promise<void> {
    const board = await this.boardRepository.findById(id);
    if (!board) throw new NotFoundException(`Board with ID ${id} not found`);
    const team = await this.teamService.findById(board.teamId, userId);
    if (!team || team.ownerId !== userId) throw new UnauthorizedException('Only the team owner can delete this board');
    // Supprime les colonnes et tâches associées (optionnel, selon tes besoins)
    await this.columnRepository.deleteByBoardId(id);
    await this.taskRepository.deleteByBoardId(id);
    await this.commentRepository.delete(id);
    await this.fileRepository.delete(id);
    await this.boardRepository.delete(id);
  }

  async createComment(taskId: string, userId: string, createData: { content: string }): Promise<KanbanCommentEntity> {
    // Vérifier que la tâche existe
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);
    console.log('Task found:', task);
    
    // Vérifier que l'utilisateur a accès au board
    const board = await this.findById(task.boardId, userId);
    if (!board) throw new UnauthorizedException('Access denied');
    console.log('Board found:', board);

    const comment = KanbanCommentEntity.create({
      id: '',
      content: createData.content,
      taskId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Comment created:', comment);
    return this.commentRepository.create(comment);
  }

  async createFile(taskId: string, userId: string, createData: { name: string; url: string }): Promise<CollaborationAttachementEntity> {
    // Vérifier que la tâche existe
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);
    
    // Vérifier que l'utilisateur a accès au board
    const board = await this.findById(task.boardId, userId);
    if (!board) throw new UnauthorizedException('Access denied');
    
    const file = CollaborationAttachementEntity.create({
      id: '',
      name: createData.name,
      url: createData.url,
      taskId,
      userId,
      type: 'file',
      size: 0,
      mimeType: 'application/octet-stream',
      thumbnailUrl: '',
      previewUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.fileRepository.create(file);
  }

  async recordTaskView(taskId: string, userId: string): Promise<CollaborationTaskViewEntity> {
    // Vérifier que la tâche existe
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);
    
    // Vérifier que l'utilisateur a accès au board
    const board = await this.findById(task.boardId, userId);
    if (!board) throw new UnauthorizedException('Access denied');
    
    const view = CollaborationTaskViewEntity.create({
      id: '',
      taskId,
      userId,
      viewedAt: new Date(),
    });
    return this.taskViewRepository.create(view);
  }

  async getTaskViews(taskId: string, userId: string): Promise<CollaborationTaskViewEntity[]> {
    return this.taskViewRepository.findByTaskId(taskId);
  }

  async getUserViews(userId: string): Promise<CollaborationTaskViewEntity[]> {
    return this.taskViewRepository.findByUserId(userId);
  }

  async getColumns(boardId: string): Promise<KanbanColumnEntity[]> {
    return this.columnRepository.getColumns(boardId);
  }
}