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
exports.BoardController = void 0;
const common_1 = require("@nestjs/common");
const board_service_1 = require("../../../interface/service/board.service");
const passport_1 = require("@nestjs/passport");
const create_board_dto_1 = require("../../../utils/dto/boad/create-board.dto");
const update_board_dto_1 = require("../../../utils/dto/boad/update-board.dto");
const kanban_task_entity_1 = require("../../../domain/entities/kanban/kanban.task.entity");
const formatRespons_1 = require("../../../utils/formatResponse/formatRespons");
const firebase_task_repository_1 = require("../../../infrastructure/repositories/firebase-task.repository");
const firebase_user_repository_1 = require("../../../infrastructure/repositories/firebase-user.repository");
const user_service_1 = require("../../../interface/service/user.service");
const constance_status_1 = require("../../../utils/constance/constance.status");
const constance_priority_1 = require("../../../utils/constance/constance.priority");
const kanban_checkList_entity_1 = require("../../../domain/entities/kanban/kanban.checkList.entity");
let BoardController = class BoardController {
    constructor(taskRepository, userRepository, boardsService, userService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.boardsService = boardsService;
        this.userService = userService;
    }
    async findAllBoardUser(req, res) {
        try {
            console.log('=== FIND ALL BOARD USER ===');
            console.log('User ID:', req.user.id);
            console.log('=== FIND ALL BOARD USER ===');
            const boards = await this.boardsService.findAllBoardUser(req.user.id);
            console.log('Boards:', boards);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Boards fetched successfully", boards);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Boards not found", error);
        }
    }
    async findAll(req, res) {
        try {
            const boards = await this.boardsService.findAll(req.query.teamId || req.user.teamId, req.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Boards fetched successfully", boards);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Boards not found", error);
        }
    }
    async getAllTaskAssignedTo(boardId, req, res) {
        try {
            const tasks = await this.taskRepository.findAllByAssignedTo(req.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'Tasks fetched successfully', tasks);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'Tasks not found', error);
        }
    }
    async findById(id, req, res) {
        try {
            const board = await this.boardsService.findById(id, req.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Board fetched successfully", board);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Board not found", error);
        }
    }
    async getColm(boardId, req, res) {
        try {
            const user = req.user;
            const columns = await this.boardsService.getColumns(boardId);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Columns fetched successfully", columns);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Error fetching columns", error.message);
        }
    }
    async create(createData, req, res) {
        try {
            const board = await this.boardsService.create(req.query.teamId || req.user.teamId, req.user.id, createData);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Board created successfully", board);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Board creation failed", error);
        }
    }
    async update(id, updates, req, res) {
        try {
            const board = await this.boardsService.update(id, updates, req.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Board updated successfully", board);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Board update failed", error);
        }
    }
    async delete(id, req, res) {
        try {
            const board = await this.boardsService.delete(id, req.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Board deleted successfully", board);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Board deletion failed", error);
        }
    }
    async createTask(boardId, createData, req, res) {
        try {
            const user = req.user;
            console.log('Creating task for board:', boardId);
            console.log('User:', user);
            console.log('Task data:', createData);
            const dueDate = createData.dueDate
                ? typeof createData.dueDate === 'string'
                    ? new Date(createData.dueDate)
                    : createData.dueDate
                : new Date();
            let taskAssignTo = [{ id: user.id, name: user.name || 'Utilisateur sans nom', email: user.email || '' }];
            if (createData.assignTo && createData.assignTo.length === 1) {
                const assignToId = createData.assignTo[0];
                const assignToDetails = await this.userRepository.findById(assignToId);
                if (!assignToDetails) {
                    throw new Error(`Utilisateur avec l'ID ${assignToId} non trouvé pour la tâche`);
                }
                taskAssignTo = [{ id: assignToDetails.id, name: assignToDetails.name || 'Utilisateur sans nom', email: assignToDetails.email || '' }];
            }
            else if (createData.checklists && createData.checklists.length > 0) {
                const firstChecklistAssignee = createData.checklists.find(checklist => checklist.assignTo && checklist.assignTo.length > 0);
                if (firstChecklistAssignee && firstChecklistAssignee.assignTo && firstChecklistAssignee.assignTo.length > 0) {
                    const assignToId = firstChecklistAssignee.assignTo[0];
                    const assignToDetails = await this.userRepository.findById(assignToId);
                    if (assignToDetails) {
                        taskAssignTo = [{ id: assignToDetails.id, name: assignToDetails.name || 'Utilisateur sans nom', email: assignToDetails.email || '' }];
                    }
                }
            }
            const task = kanban_task_entity_1.KanbanTaskEntity.create({
                boardId,
                columnId: createData.columnId,
                title: createData.title,
                description: createData.description,
                dueDate,
                status: createData.status || constance_status_1.Status.PENDING,
                assignTo: taskAssignTo,
                createdBy: user.id,
                priority: createData.priority || constance_priority_1.Priority.MEDIUM,
            });
            const savedTask = await this.taskRepository.create(task);
            if (createData.checklists && createData.checklists.length > 0) {
                const checklists = await Promise.all(createData.checklists.map(async (checklist) => {
                    if (!checklist.assignTo || checklist.assignTo.length !== 1) {
                        throw new Error('Chaque checklist doit être assignée à exactement un utilisateur');
                    }
                    const assignToId = checklist.assignTo[0];
                    const assignToDetails = await this.userRepository.findById(assignToId);
                    if (!assignToDetails) {
                        throw new Error(`Utilisateur avec l'ID ${assignToId} non trouvé`);
                    }
                    return kanban_checkList_entity_1.KanbanChecklistEntity.create({
                        id: '',
                        taskId: savedTask.id,
                        title: checklist.title,
                        assignToId: assignToDetails.id,
                        assignToName: assignToDetails.name || '',
                        assignToEmail: assignToDetails.email || '',
                    });
                }));
                const savedChecklists = await Promise.all(checklists.map((checklist) => this.taskRepository.createChecklist(checklist, user.id)));
                savedTask.checklistIds = savedChecklists.map((c) => c.id);
                await this.taskRepository.update(savedTask);
            }
            return (0, formatRespons_1.formatResponse)(res, 201, 'success', 'Tâche créée avec succès', savedTask);
        }
        catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'Échec de la création de la tâche', error.message);
        }
    }
    async getAllTask(boardId, req, res) {
        try {
            console.log('Getting all tasks for board:', boardId);
            console.log('User:', req.user);
            const tasks = await this.taskRepository.findAllByBoardId(boardId);
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'Tasks fetched successfully', tasks);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'Tasks not found', error);
        }
    }
    async moveTask(boardId, taskId, newColumnId, req, res) {
        try {
            console.log('Moving task:', taskId, 'to column:', newColumnId, 'by user:', req.user.id);
            const task = await this.taskRepository.findById(taskId);
            const columns = await this.taskRepository.getColumnsByBoardId(boardId);
            console.log('Columns:', columns);
            console.log('column status:', columns.find(column => column.id === newColumnId)?.status);
            const columnStatus = columns.find(column => column.id === newColumnId)?.status;
            if (!columnStatus) {
                return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'Column not found or has no status', null);
            }
            task.columnId = newColumnId;
            task.status = columnStatus;
            task.updatedAt = new Date();
            console.log('Updated task:', {
                id: task.id,
                title: task.title,
                columnId: task.columnId,
                status: task.status
            });
            const updatedTask = await this.taskRepository.update(task);
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'Task moved successfully', updatedTask);
        }
        catch (error) {
            console.error('Error moving task:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'Task move failed', error.message);
        }
    }
    async createComment(boardId, taskId, createData, req, res) {
        try {
            console.log('Creating comment for task:', taskId, 'by user:', req.user.id);
            const comment = await this.boardsService.createComment(taskId, req.user.id, createData);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Comment created successfully", comment);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Comment creation failed", error);
        }
    }
    async createFile(boardId, taskId, req, res) {
        try {
            const file = await this.boardsService.createFile(taskId, req.user.id, req.body);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "File created successfully", file);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "File creation failed", error);
        }
    }
    async recordTaskView(boardId, taskId, req, res) {
        try {
            const view = await this.boardsService.recordTaskView(taskId, req.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Task viewed successfully", view);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Task view failed", error);
        }
    }
    async getUserViews(req, res) {
        try {
            const views = await this.boardsService.getUserViews(req.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User views fetched successfully", views);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "User views not found", error);
        }
    }
    async getColumns(boardId, req, res) {
        try {
            const user = req.user;
            const columns = await this.boardsService.getColumns(boardId);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Columns fetched successfully", columns);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Error fetching columns", error.message);
        }
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "findAllBoardUser", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tasks/assigned-to'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getAllTaskAssignedTo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(':boardId/columns'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getColm", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_dto_1.CreateBoardDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_board_dto_1.UpdateBoardDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':boardId/tasks'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)(':boardId/tasks'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getAllTask", null);
__decorate([
    (0, common_1.Patch)(':boardId/tasks/:taskId/move'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)('newColumnId')),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "moveTask", null);
__decorate([
    (0, common_1.Post)(':boardId/tasks/:taskId/comments'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "createComment", null);
__decorate([
    (0, common_1.Post)(':boardId/tasks/:taskId/files'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "createFile", null);
__decorate([
    (0, common_1.Post)(':boardId/tasks/:taskId/views'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "recordTaskView", null);
__decorate([
    (0, common_1.Get)('views'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getUserViews", null);
__decorate([
    (0, common_1.Get)(':boardId/columns'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getColumns", null);
exports.BoardController = BoardController = __decorate([
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [firebase_task_repository_1.FirebaseTaskRepository,
        firebase_user_repository_1.FirebaseUserRepository,
        board_service_1.BoardsService,
        user_service_1.UserService])
], BoardController);
//# sourceMappingURL=borads.controller.js.map