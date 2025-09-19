import type { Response } from 'express';
import { TasksService } from '../../service/task.service';
import { CreateTaskDto } from '../../../utils/dto/task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    createTask(req: any, res: Response, boardId: string, createTaskDto: CreateTaskDto): Promise<Response<any, Record<string, any>>>;
    getTaskById(res: Response, taskId: string): Promise<Response<any, Record<string, any>>>;
    addAssignedToChecklist(res: Response, checklistId: string, assignedTo: string): Promise<Response<any, Record<string, any>>>;
    removeAssignedToChecklist(checklistId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
