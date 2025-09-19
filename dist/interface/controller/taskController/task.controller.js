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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const formatRespons_1 = require("../../../utils/formatResponse/formatRespons");
const task_service_1 = require("../../service/task.service");
const task_dto_1 = require("../../../utils/dto/task.dto");
const firebase_auth_guard_1 = require("../../../config/jwt/firebase-auth.guard");
const common_2 = require("@nestjs/common");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async createTask(req, res, boardId, createTaskDto) {
        const userId = req.user.id;
        console.log('columnId', createTaskDto.columnId);
        console.log('payload', createTaskDto);
        const task = await this.tasksService.createTask(boardId, createTaskDto.columnId, createTaskDto, userId);
        console.log('----------------------------------------------------------------');
        console.log(task);
        console.log('----------------------------------------------------------------');
        return (0, formatRespons_1.formatResponse)(res, 201, "success", "Task created successfully", task);
    }
    async getTaskById(res, taskId) {
        const task = await this.tasksService.findTaskById(taskId);
        return (0, formatRespons_1.formatResponse)(res, 200, "success", "Task retrieved successfully", task);
    }
    async addAssignedToChecklist(res, checklistId, assignedTo) {
        console.log('----------------------------------------------------------------');
        console.log('assignedTo', assignedTo);
        console.log('checklistId', checklistId);
        console.log('----------------------------------------------------------------');
        const checklist = await this.tasksService.addAssignedToChecklist(checklistId, assignedTo);
        return (0, formatRespons_1.formatResponse)(res, 200, "success", "Assigned to checklist successfully", checklist);
    }
    async removeAssignedToChecklist(checklistId, res) {
        console.log('----------------------------------------------------------------');
        console.log('checklistId', checklistId);
        console.log('----------------------------------------------------------------');
        const checklist = await this.tasksService.removeAssignedToChecklist(checklistId);
        return (0, formatRespons_1.formatResponse)(res, 200, "success", "Unassigned from checklist successfully", checklist);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('boardId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)(':taskId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Patch)('checklists/:checklistId/assign'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('checklistId')),
    __param(2, (0, common_1.Body)('assignedTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "addAssignedToChecklist", null);
__decorate([
    (0, common_1.Patch)('checklists/:checklistId/unassign'),
    __param(0, (0, common_1.Param)('checklistId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "removeAssignedToChecklist", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('boards/:boardId/tasks'),
    (0, common_2.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_2.UsePipes)(new common_2.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [task_service_1.TasksService])
], TasksController);
//# sourceMappingURL=task.controller.js.map