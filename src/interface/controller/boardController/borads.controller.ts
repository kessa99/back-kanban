import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, Res } from '@nestjs/common';
import { BoardsService } from '../../../interface/service/board.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBoardDto } from '../../../utils/dto/boad/create-board.dto';
import { UpdateBoardDto } from '../../../utils/dto/boad/update-board.dto';
import type { KanbanBoardEntity } from '../../../domain/entities/kanban/kaban.board.entity';
import { KanbanTaskEntity } from '../../../domain/entities/kanban/kanban.task.entity';
import type { KanbanCommentEntity } from '../../../domain/entities/collaboration/collaboration.comment.entity';
import type { CollaborationAttachementEntity } from '../../../domain/entities/collaboration/collaboration.attachement.entity';
import type { CollaborationTaskViewEntity } from '../../../domain/entities/collaboration/collaboration.taskView.entity';
import { formatResponse } from '../../../utils/formatResponse/formatRespons';
import type { Response } from 'express';
import type { UserEntity } from '../../../domain/entities/userTeam/userTeam.user.entity';
import { FirebaseTaskRepository } from '../../../infrastructure/repositories/firebase-task.repository';
import { FirebaseUserRepository } from '../../../infrastructure/repositories/firebase-user.repository';
import { UserService } from '../../../interface/service/user.service';
import { Status } from '../../../utils/constance/constance.status';
import { Priority } from '../../../utils/constance/constance.priority';
import { KanbanChecklistEntity } from '../../../domain/entities/kanban/kanban.checkList.entity'; 


@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardController {
  constructor(
    private readonly taskRepository: FirebaseTaskRepository,
    private readonly userRepository: FirebaseUserRepository,
    private readonly boardsService: BoardsService,
    private readonly userService: UserService,
  ) {}

  // 1. Routes spécifiques (sans paramètres)
  @Get('user')
  async findAllBoardUser(@Request() req, @Res() res: Response) {
    try {
      console.log('=== FIND ALL BOARD USER ===');
      console.log('User ID:', req.user.id);
      console.log('=== FIND ALL BOARD USER ===');
      const boards = await this.boardsService.findAllBoardUser(req.user.id);
      console.log('Boards:', boards);
      return formatResponse(res, 200, "success", "Boards fetched successfully", boards);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Boards not found", error);
    }
  }
  
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const boards = await this.boardsService.findAll(req.query.teamId || req.user.teamId, req.user.id);
      return formatResponse(res, 200, "success", "Boards fetched successfully", boards);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Boards not found", error);
    }
  }

  @Get('tasks/assigned-to')
  async getAllTaskAssignedTo(@Param('boardId') boardId: string, @Request() req, @Res() res: Response) {
    try {
      const tasks = await this.taskRepository.findAllByAssignedTo(req.user.id);
      return formatResponse(res, 200, 'success', 'Tasks fetched successfully', tasks);
    } catch (error) {
      return formatResponse(res, 400, 'failed', 'Tasks not found', error);
    }
  }

  // 2. Routes paramétrées (avec paramètres)
  @Get(':id')
  async findById(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const board = await this.boardsService.findById(id, req.user.id);
      return formatResponse(res, 200, "success", "Board fetched successfully", board);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Board not found", error);
    }
  }

  @Get(':boardId/columns')
  async getColm(@Param('boardId') boardId: string, @Request() req: any, @Res() res: Response) {
    try {
      const user = req.user as UserEntity;
      // if (!user.otpVerified) {
      //   return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
      // }
      
      const columns = await this.boardsService.getColumns(boardId);
      return formatResponse(res, 200, "success", "Columns fetched successfully", columns);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Error fetching columns", error.message);
    }
  }

  // @Get(':boardId/tasks')
  // async getAllTask(@Param('boardId') boardId: string, @Request() req, @Res() res: Response) {
  //   try {
  //     console.log('Getting all tasks for board:', boardId);
  //     console.log('User:', req.user);
  //     const tasks = await this.taskRepository.findAllByBoardId(boardId);
  //     return formatResponse(res, 200, 'success', 'Tasks fetched successfully', tasks);
  //   } catch (error) {
  //     return formatResponse(res, 400, 'failed', 'Tasks not found', error);
  //   }
  // }

  @Post()
  async create(@Body() createData: CreateBoardDto, @Request() req, @Res() res: Response) {
    try {
      const board = await this.boardsService.create(req.query.teamId || req.user.teamId, req.user.id, createData);
      return formatResponse(res, 200, "success", "Board created successfully", board);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Board creation failed", error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updates: UpdateBoardDto, @Request() req, @Res() res: Response) {
    try {
      const board = await this.boardsService.update(id, updates, req.user.id);
      return formatResponse(res, 200, "success", "Board updated successfully", board);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Board update failed", error);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const board = await this.boardsService.delete(id, req.user.id);
      return formatResponse(res, 200, "success", "Board deleted successfully", board);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Board deletion failed", error);
    }
  }
  
  @Post(':boardId/tasks')
async createTask(
  @Param('boardId') boardId: string,
  @Body() createData: {
    title: string;
    description?: string;
    columnId: string;
    dueDate?: Date | string;
    status?: Status;
    priority?: Priority;
    assignTo?: string[];
    checklists?: { title: string; assignTo?: string[]; dueDate?: Date | string }[];
  },
  @Request() req: any,
  @Res() res: Response,
) {
  try {
    const user = req.user as UserEntity;
    console.log('Creating task for board:', boardId);
    console.log('User:', user);
    console.log('Task data:', createData);

    // if (!user.otpVerified) {
    //   return formatResponse(res, 400, 'failed', 'Vous devez vérifier votre email pour accéder à cette fonctionnalité', null);
    // }

    // Convertir dueDate si c'est une string ISO
    const dueDate = createData.dueDate
      ? typeof createData.dueDate === 'string'
        ? new Date(createData.dueDate)
        : createData.dueDate
      : new Date();

    // Récupérer les utilisateurs assignés depuis les checklists
    let taskAssignTo = [{ id: user.id, name: user.name || 'Utilisateur sans nom', email: user.email || '' }];
    
    // Si assignTo est fourni au niveau de la tâche
    if (createData.assignTo && createData.assignTo.length === 1) {
      const assignToId = createData.assignTo[0];
      const assignToDetails = await this.userRepository.findById(assignToId);
      if (!assignToDetails) {
        throw new Error(`Utilisateur avec l'ID ${assignToId} non trouvé pour la tâche`);
      }
      taskAssignTo = [{ id: assignToDetails.id, name: assignToDetails.name || 'Utilisateur sans nom', email: assignToDetails.email || '' }];
    }
    // Sinon, utiliser l'assignation des checklists
    else if (createData.checklists && createData.checklists.length > 0) {
      // Prendre le premier utilisateur assigné dans les checklists
      const firstChecklistAssignee = createData.checklists.find(checklist => checklist.assignTo && checklist.assignTo.length > 0);
      if (firstChecklistAssignee && firstChecklistAssignee.assignTo && firstChecklistAssignee.assignTo.length > 0) {
        const assignToId = firstChecklistAssignee.assignTo[0];
        const assignToDetails = await this.userRepository.findById(assignToId);
        if (assignToDetails) {
          taskAssignTo = [{ id: assignToDetails.id, name: assignToDetails.name || 'Utilisateur sans nom', email: assignToDetails.email || '' }];
        }
      }
    }

    // Créer la tâche avec assignation basée sur les checklists
    const task = KanbanTaskEntity.create({
      boardId,
      columnId: createData.columnId,
      title: createData.title,
      description: createData.description,
      dueDate,
      status: createData.status || Status.PENDING,
      assignTo: taskAssignTo,
      createdBy: user.id,
      priority: createData.priority || Priority.MEDIUM,
    });

    const savedTask = await this.taskRepository.create(task);

    // Gérer les checklists avec assignation individuelle
    if (createData.checklists && createData.checklists.length > 0) {
      const checklists = await Promise.all(
        createData.checklists.map(async (checklist) => {
          // Valider qu'il n'y a qu'un seul utilisateur dans assignTo
          if (!checklist.assignTo || checklist.assignTo.length !== 1) {
            throw new Error('Chaque checklist doit être assignée à exactement un utilisateur');
          }

          const assignToId = checklist.assignTo[0];
          // Récupérer les détails de l'utilisateur assigné
          const assignToDetails = await this.userRepository.findById(assignToId);

          if (!assignToDetails) {
            throw new Error(`Utilisateur avec l'ID ${assignToId} non trouvé`);
          }

          return KanbanChecklistEntity.create({
            id: '',
            taskId: savedTask.id,
            title: checklist.title,
            assignToId: assignToDetails.id,
            assignToName: assignToDetails.name || '',
            assignToEmail: assignToDetails.email || '',
          });
        }),
      );

      const savedChecklists = await Promise.all(
        checklists.map((checklist) => this.taskRepository.createChecklist(checklist, user.id)),
      );
      savedTask.checklistIds = savedChecklists.map((c) => c.id);
      await this.taskRepository.update(savedTask);
    }

    return formatResponse(res, 201, 'success', 'Tâche créée avec succès', savedTask);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    return formatResponse(res, 400, 'failed', 'Échec de la création de la tâche', error.message);
  }
}

  // @Get('tasks/assigned-to')
  // async getAllTaskAssignedTo(@Param('boardId') boardId: string, @Request() req, @Res() res: Response) {
  //   try {
  //     const tasks = await this.taskRepository.findAllByAssignedTo(req.user.id);
  //     return formatResponse(res, 200, 'success', 'Tasks fetched successfully', tasks);
  //   } catch (error) {
  //     return formatResponse(res, 400, 'failed', 'Tasks not found', error);
  //   }
  // }

  @Get(':boardId/tasks')
  async getAllTask(@Param('boardId') boardId: string, @Request() req, @Res() res: Response) {
    try {
      console.log('Getting all tasks for board:', boardId);
      console.log('User:', req.user);
      const tasks = await this.taskRepository.findAllByBoardId(boardId);
      return formatResponse(res, 200, 'success', 'Tasks fetched successfully', tasks);
    } catch (error) {
      return formatResponse(res, 400, 'failed', 'Tasks not found', error);
    }
  }

  @Patch(':boardId/tasks/:taskId/move')
  async moveTask(
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Body('newColumnId') newColumnId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      console.log('Moving task:', taskId, 'to column:', newColumnId, 'by user:', req.user.id);

      // Récupérer la tâche existante
      const task = await this.taskRepository.findById(taskId);

      // Récupérer les colonnes pour obtenir le statut de la nouvelle colonne
      const columns = await this.taskRepository.getColumnsByBoardId(boardId);
      console.log('Columns:', columns);
      console.log('column status:', columns.find(column => column.id === newColumnId)?.status);
      const columnStatus = columns.find(column => column.id === newColumnId)?.status;
      
      if (!columnStatus) {
        return formatResponse(res, 400, 'failed', 'Column not found or has no status', null);
      }

      // Mettre à jour la tâche avec le nouveau columnId et le nouveau status
      task.columnId = newColumnId;
      task.status = columnStatus;
      task.updatedAt = new Date();
      
      console.log('Updated task:', {
        id: task.id,
        title: task.title,
        columnId: task.columnId,
        status: task.status
      });

      // Utiliser la méthode update complète au lieu de updateStatusTask
      const updatedTask = await this.taskRepository.update(task);
      return formatResponse(res, 200, 'success', 'Task moved successfully', updatedTask);
    } catch (error) {
      console.error('Error moving task:', error);
      return formatResponse(res, 400, 'failed', 'Task move failed', error.message);
    }
  }

  //comment
  @Post(':boardId/tasks/:taskId/comments')
  async createComment(@Param('boardId') boardId: string, @Param('taskId') taskId: string, @Body() createData: { content: string }, @Request() req, @Res() res: Response) {
    try {
      console.log('Creating comment for task:', taskId, 'by user:', req.user.id);
      const comment = await this.boardsService.createComment(taskId, req.user.id, createData);
      return formatResponse(res, 200, "success", "Comment created successfully", comment);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Comment creation failed", error);
    }
  }

  //file
  @Post(':boardId/tasks/:taskId/files')
  async createFile(@Param('boardId') boardId: string, @Param('taskId') taskId: string, @Request() req, @Res() res: Response) {
    try {
      const file = await this.boardsService.createFile(taskId, req.user.id, req.body);
      return formatResponse(res, 200, "success", "File created successfully", file);
    } catch (error) {
      return formatResponse(res, 400, "failed", "File creation failed", error);
    }
  }

  //view
  @Post(':boardId/tasks/:taskId/views')
  async recordTaskView(@Param('boardId') boardId: string, @Param('taskId') taskId: string, @Request() req, @Res() res: Response) {
    try {
      const view = await this.boardsService.recordTaskView(taskId, req.user.id);
      return formatResponse(res, 200, "success", "Task viewed successfully", view);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Task view failed", error);
    }
  }

  @Get('views')
  async getUserViews(@Request() req, @Res() res: Response) {
    try {
      const views = await this.boardsService.getUserViews(req.user.id);
      return formatResponse(res, 200, "success", "User views fetched successfully", views);
    } catch (error) {
      return formatResponse(res, 400, "failed", "User views not found", error);
    }
  }

  @Get(':boardId/columns')
  async getColumns(@Param('boardId') boardId: string, @Request() req: any, @Res() res: Response) {
    try {
      const user = req.user as UserEntity;
      // if (!user.otpVerified) {
      //   return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
      // }
      
      const columns = await this.boardsService.getColumns(boardId);
      return formatResponse(res, 200, "success", "Columns fetched successfully", columns);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Error fetching columns", error.message);
    }
  }
}