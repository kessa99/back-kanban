import { KanbanBoardEntity } from '../../domain/entities/kanban/kaban.board.entity';
import { FirebaseBoardRepository } from '../../infrastructure/repositories/firebase-board.repository';
import { TeamService } from './team.service';
import { KanbanColumnEntity } from '../../domain/entities/kanban/kaban.column.entity';
import { FirebaseColumnRepository } from '../../infrastructure/repositories/firebase-column.repository';
import { FirebaseTaskRepository } from '../../infrastructure/repositories/firebase-task.repository';
import { FirebaseCommentRepository, FirebaseFileRepository } from '../../infrastructure/repositories/firebase-commentAndFile.repo';
import { KanbanTaskEntity } from '../../domain/entities/kanban/kanban.task.entity';
import { KanbanCommentEntity } from '../../domain/entities/collaboration/collaboration.comment.entity';
import { CollaborationAttachementEntity } from '../../domain/entities/collaboration/collaboration.attachement.entity';
import { CollaborationTaskViewEntity } from '../../domain/entities/collaboration/collaboration.taskView.entity';
import { FirebaseTaskViewRepository } from '../../infrastructure/repositories/firebase-viewTask.repository';
import { Status } from '../../utils/constance/constance.status';
import { Priority } from '../../utils/constance/constance.priority';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
export declare class BoardsService {
    private readonly boardRepository;
    private readonly teamService;
    private readonly columnRepository;
    private readonly taskRepository;
    private readonly commentRepository;
    private readonly fileRepository;
    private readonly taskViewRepository;
    private readonly userRepository;
    constructor(boardRepository: FirebaseBoardRepository, teamService: TeamService, columnRepository: FirebaseColumnRepository, taskRepository: FirebaseTaskRepository, commentRepository: FirebaseCommentRepository, fileRepository: FirebaseFileRepository, taskViewRepository: FirebaseTaskViewRepository, userRepository: FirebaseUserRepository);
    findAll(teamId: string, userId: string): Promise<(KanbanBoardEntity & {
        columns: KanbanColumnEntity[];
    })[]>;
    findAllBoardUser(userId: string): Promise<(KanbanBoardEntity & {
        columns: KanbanColumnEntity[];
    })[]>;
    create(teamId: string, userId: string, createData: {
        name: string;
        description: string;
    }): Promise<KanbanBoardEntity>;
    createTask(boardId: string, userId: string, createData: {
        title: string;
        description?: string;
        columnId: string;
        dueDate?: Date;
        status?: Status;
        assignTo?: string | string[];
        priority?: Priority;
        tagIds?: string[];
        checklistIds?: string[];
        parentTaskId?: string;
    }): Promise<KanbanTaskEntity>;
    getAllTask(boardId: string, userId: string): Promise<KanbanTaskEntity[]>;
    getAllTaskAssignedTo(boardId: string, userId: string): Promise<KanbanTaskEntity[]>;
    findById(id: string, userId: string): Promise<KanbanBoardEntity & {
        columns: KanbanColumnEntity[];
    }>;
    update(id: string, updates: {
        name?: string;
        description?: string;
    }, userId: string): Promise<KanbanBoardEntity>;
    updateTaskColumn(taskId: string, newColumnId: string, userId: string): Promise<KanbanTaskEntity>;
    delete(id: string, userId: string): Promise<void>;
    createComment(taskId: string, userId: string, createData: {
        content: string;
    }): Promise<KanbanCommentEntity>;
    createFile(taskId: string, userId: string, createData: {
        name: string;
        url: string;
    }): Promise<CollaborationAttachementEntity>;
    recordTaskView(taskId: string, userId: string): Promise<CollaborationTaskViewEntity>;
    getTaskViews(taskId: string, userId: string): Promise<CollaborationTaskViewEntity[]>;
    getUserViews(userId: string): Promise<CollaborationTaskViewEntity[]>;
    getColumns(boardId: string): Promise<KanbanColumnEntity[]>;
}
