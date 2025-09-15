import { FirebaseTaskRepository } from 'src/infrastructure/repositories/firebase-task.repository';
import { BoardsService } from 'src/interface/service/board.service';
import { UserService } from 'src/interface/service/user.service';
import { FirebaseUserRepository } from 'src/infrastructure/repositories/firebase-user.repository';
export declare class TasksController {
    private readonly taskRepository;
    private readonly userRepository;
    private readonly boardsService;
    private readonly userService;
    constructor(taskRepository: FirebaseTaskRepository, userRepository: FirebaseUserRepository, boardsService: BoardsService, userService: UserService);
}
