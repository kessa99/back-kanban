"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const firebase_task_repository_1 = require("../../../infrastructure/repositories/firebase-task.repository");
const board_service_1 = require("../../../interface/service/board.service");
const user_service_1 = require("../../../interface/service/user.service");
const firebase_user_repository_1 = require("../../../infrastructure/repositories/firebase-user.repository");
let TasksController = class TasksController {
    constructor(taskRepository, userRepository, boardsService, userService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.boardsService = boardsService;
        this.userService = userService;
    }
};
exports.TasksController = TasksController;
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('task-board'),
    __metadata("design:paramtypes", [firebase_task_repository_1.FirebaseTaskRepository,
        firebase_user_repository_1.FirebaseUserRepository,
        board_service_1.BoardsService,
        user_service_1.UserService])
], TasksController);
//# sourceMappingURL=task.controller.js.map