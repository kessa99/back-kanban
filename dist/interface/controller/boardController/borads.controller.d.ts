import { BoardsService } from '../../../interface/service/board.service';
import { CreateBoardDto } from '../../../utils/dto/boad/create-board.dto';
import { UpdateBoardDto } from '../../../utils/dto/boad/update-board.dto';
import type { Response } from 'express';
import { FirebaseTaskRepository } from '../../../infrastructure/repositories/firebase-task.repository';
import { FirebaseUserRepository } from '../../../infrastructure/repositories/firebase-user.repository';
import { UserService } from '../../../interface/service/user.service';
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
