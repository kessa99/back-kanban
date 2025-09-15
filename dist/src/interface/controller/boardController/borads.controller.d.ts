import { BoardsService } from 'src/interface/service/board.service';
import { CreateBoardDto } from 'src/utils/dto/boad/create-board.dto';
import { UpdateBoardDto } from 'src/utils/dto/boad/update-board.dto';
import type { Response } from 'express';
import { FirebaseTaskRepository } from 'src/infrastructure/repositories/firebase-task.repository';
import { FirebaseUserRepository } from 'src/infrastructure/repositories/firebase-user.repository';
import { UserService } from 'src/interface/service/user.service';
import { Status } from 'src/utils/constance/constance.status';
import { Priority } from 'src/utils/constance/constance.priority';
export declare class BoardController {
    private readonly taskRepository;
    private readonly userRepository;
    private readonly boardsService;
    private readonly userService;
    constructor(taskRepository: FirebaseTaskRepository, userRepository: FirebaseUserRepository, boardsService: BoardsService, userService: UserService);
    findAllBoardUser(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllTaskAssignedTo(boardId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findById(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getColm(boardId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    create(createData: CreateBoardDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: string, updates: UpdateBoardDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    createTask(boardId: string, createData: {
        title: string;
        description?: string;
        columnId: string;
        dueDate?: Date | string;
        status?: Status;
        priority?: Priority;
        assignTo?: string[];
        checklists?: {
            title: string;
            assignTo?: string[];
            dueDate?: Date | string;
        }[];
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllTask(boardId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    moveTask(boardId: string, taskId: string, newColumnId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    createComment(boardId: string, taskId: string, createData: {
        content: string;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    createFile(boardId: string, taskId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    recordTaskView(boardId: string, taskId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getUserViews(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getColumns(boardId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
