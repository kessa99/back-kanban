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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const kaban_board_entity_1 = require("../../domain/entities/kanban/kaban.board.entity");
const firebase_board_repository_1 = require("../../infrastructure/repositories/firebase-board.repository");
const team_service_1 = require("./team.service");
const kaban_column_entity_1 = require("../../domain/entities/kanban/kaban.column.entity");
const firebase_column_repository_1 = require("../../infrastructure/repositories/firebase-column.repository");
const firebase_task_repository_1 = require("../../infrastructure/repositories/firebase-task.repository");
const firebase_commentAndFile_repo_1 = require("../../infrastructure/repositories/firebase-commentAndFile.repo");
const kanban_task_entity_1 = require("../../domain/entities/kanban/kanban.task.entity");
const collaboration_comment_entity_1 = require("../../domain/entities/collaboration/collaboration.comment.entity");
const collaboration_attachement_entity_1 = require("../../domain/entities/collaboration/collaboration.attachement.entity");
const collaboration_taskView_entity_1 = require("../../domain/entities/collaboration/collaboration.taskView.entity");
const firebase_viewTask_repository_1 = require("../../infrastructure/repositories/firebase-viewTask.repository");
const constance_status_1 = require("../../utils/constance/constance.status");
const firebase_user_repository_1 = require("../../infrastructure/repositories/firebase-user.repository");
let BoardsService = class BoardsService {
    constructor(boardRepository, teamService, columnRepository, taskRepository, commentRepository, fileRepository, taskViewRepository, userRepository) {
        this.boardRepository = boardRepository;
        this.teamService = teamService;
        this.columnRepository = columnRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.fileRepository = fileRepository;
        this.taskViewRepository = taskViewRepository;
        this.userRepository = userRepository;
    }
    async findAll(teamId, userId) {
        const team = await this.teamService.findById(teamId, userId);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${teamId} not found`);
        const boards = await this.boardRepository.findAllByTeamId(teamId);
        const filteredBoards = boards.filter(board => board.teamId === teamId && (board.userId === userId || team.members.includes(userId)));
        console.log('------------------------------------------------------------------');
        console.log('Filtered boards:', filteredBoards);
        console.log('------------------------------------------------------------------');
        const boardsWithColumns = await Promise.all(filteredBoards.map(async (board) => {
            const columns = await this.columnRepository.findAllByBoardId(board.id);
            return {
                ...board,
                columns: columns
            };
        }));
        return boardsWithColumns;
    }
    async findAllBoardUser(userId) {
        const boards = await this.boardRepository.findAllBoardUser(userId);
        console.log('------------------------------------------------------------------');
        console.log('Boards:', boards);
        console.log('------------------------------------------------------------------');
        const filteredBoards = boards.filter(board => board.userId === userId);
        console.log('Filtered boards:', filteredBoards);
        console.log('------------------------------------------------------------------');
        const boardsWithColumns = await Promise.all(filteredBoards.map(async (board) => {
            const columns = await this.columnRepository.findAllByBoardId(board.id);
            return {
                ...board,
                columns: columns
            };
        }));
        return boardsWithColumns;
    }
    async create(teamId, userId, createData) {
        const team = await this.teamService.findById(teamId, userId);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${teamId} not found`);
        if (team.ownerId !== userId)
            throw new common_1.UnauthorizedException('Only the team owner can create boards');
        const board = kaban_board_entity_1.KanbanBoardEntity.create({
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
        const defaultColumns = [
            { name: 'Todo', status: constance_status_1.Status.PENDING },
            { name: 'In Progress', status: constance_status_1.Status.IN_PROGRESS },
            { name: 'Review', status: constance_status_1.Status.IN_PROGRESS },
            { name: 'Done', status: constance_status_1.Status.COMPLETED },
        ];
        console.log('Creating default columns...');
        try {
            const columnPromises = defaultColumns.map(col => {
                console.log('Creating column:', col.name, 'with status:', col.status, 'for board:', createdBoard.id);
                return this.columnRepository.create(kaban_column_entity_1.KanbanColumnEntity.create({
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
            const columnIds = createdColumns.map(col => col.id);
            return {
                ...createdBoard,
                columnIds: columnIds
            };
        }
        catch (error) {
            console.error('Error creating columns:', error);
            throw error;
        }
    }
    async createTask(boardId, userId, createData) {
        console.log('BoardService.createTask called with:', { boardId, userId, createData });
        const board = await this.boardRepository.findById(boardId);
        console.log('Board found:', board);
        if (!board)
            throw new common_1.NotFoundException(`Board with ID ${boardId} not found`);
        const team = await this.teamService.findById(board.teamId, userId);
        console.log('Team found:', team);
        if (!team || (team.ownerId !== userId && !team.members.includes(userId))) {
            throw new common_1.UnauthorizedException('Access denied: Not a member of this team');
        }
        let assignToArray = [];
        if (assignToArray.length > 0) {
            const allTeamMembers = [team.ownerId, ...team.members];
            const invalidAssignees = assignToArray.filter(assignee => !allTeamMembers.includes(assignee.id));
            if (invalidAssignees.length > 0) {
                throw new common_1.UnauthorizedException(`Users ${invalidAssignees.map(a => a.name).join(', ')} are not members of this team`);
            }
        }
        console.log('Creating task entity...');
        const task = kanban_task_entity_1.KanbanTaskEntity.create({
            id: '',
            taskId: '',
            title: createData.title,
            description: createData.description,
            columnId: createData.columnId,
            boardId,
            dueDate: createData.dueDate,
            status: createData.status,
            assignTo: assignToArray.length > 0 ? assignToArray : [{ id: userId, name: '', email: '' }],
            createdBy: userId,
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
    async getAllTask(boardId, userId) {
        return this.taskRepository.findAllByBoardId(boardId);
    }
    async getAllTaskAssignedTo(boardId, userId) {
        return this.taskRepository.findAllByAssignedTo(boardId);
    }
    async findById(id, userId) {
        const board = await this.boardRepository.findById(id);
        if (!board)
            throw new common_1.NotFoundException(`Board with ID ${id} not found`);
        const team = await this.teamService.findById(board.teamId, userId);
        console.log('------------------------------------------------------------------');
        console.log('Team:', team);
        console.log('------------------------------------------------------------------');
        if (!team) {
            throw new common_1.UnauthorizedException('Access denied: Not a member of this team');
        }
        const columns = await this.columnRepository.findAllByBoardId(id);
        return {
            ...board,
            columns: columns
        };
    }
    async update(id, updates, userId) {
        const board = await this.boardRepository.findById(id);
        if (!board)
            throw new common_1.NotFoundException(`Board with ID ${id} not found`);
        const team = await this.teamService.findById(board.teamId, userId);
        if (!team || team.ownerId !== userId)
            throw new common_1.UnauthorizedException('Only the team owner can update this board');
        const updatedBoard = { ...board, ...updates, updatedAt: new Date() };
        return this.boardRepository.update(updatedBoard);
    }
    async updateTaskColumn(taskId, newColumnId, userId) {
        const task = await this.taskRepository.findById(taskId);
        if (!task)
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        const board = await this.findById(task.boardId, userId);
        if (!board)
            throw new common_1.UnauthorizedException('Access denied');
        const newColumn = await this.columnRepository.findById(newColumnId);
        if (!newColumn || newColumn.boardId !== task.boardId) {
            throw new common_1.NotFoundException(`Column with ID ${newColumnId} not found or not part of this board`);
        }
        const updatedTask = {
            ...task,
            columnId: newColumnId,
            status: newColumn.status,
            updatedAt: new Date()
        };
        console.log(`Task ${taskId} moved to column ${newColumnId} with status ${newColumn.status}`);
        return this.taskRepository.update(updatedTask);
    }
    async delete(id, userId) {
        const board = await this.boardRepository.findById(id);
        if (!board)
            throw new common_1.NotFoundException(`Board with ID ${id} not found`);
        const team = await this.teamService.findById(board.teamId, userId);
        if (!team || team.ownerId !== userId)
            throw new common_1.UnauthorizedException('Only the team owner can delete this board');
        await this.columnRepository.deleteByBoardId(id);
        await this.taskRepository.deleteByBoardId(id);
        await this.commentRepository.delete(id);
        await this.fileRepository.delete(id);
        await this.boardRepository.delete(id);
    }
    async createComment(taskId, userId, createData) {
        const task = await this.taskRepository.findById(taskId);
        if (!task)
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        console.log('Task found:', task);
        const board = await this.findById(task.boardId, userId);
        if (!board)
            throw new common_1.UnauthorizedException('Access denied');
        console.log('Board found:', board);
        const comment = collaboration_comment_entity_1.KanbanCommentEntity.create({
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
    async createFile(taskId, userId, createData) {
        const task = await this.taskRepository.findById(taskId);
        if (!task)
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        const board = await this.findById(task.boardId, userId);
        if (!board)
            throw new common_1.UnauthorizedException('Access denied');
        const file = collaboration_attachement_entity_1.CollaborationAttachementEntity.create({
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
    async recordTaskView(taskId, userId) {
        const task = await this.taskRepository.findById(taskId);
        if (!task)
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        const board = await this.findById(task.boardId, userId);
        if (!board)
            throw new common_1.UnauthorizedException('Access denied');
        const view = collaboration_taskView_entity_1.CollaborationTaskViewEntity.create({
            id: '',
            taskId,
            userId,
            viewedAt: new Date(),
        });
        return this.taskViewRepository.create(view);
    }
    async getTaskViews(taskId, userId) {
        return this.taskViewRepository.findByTaskId(taskId);
    }
    async getUserViews(userId) {
        return this.taskViewRepository.findByUserId(userId);
    }
    async getColumns(boardId) {
        return this.columnRepository.getColumns(boardId);
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_board_repository_1.FirebaseBoardRepository,
        team_service_1.TeamService,
        firebase_column_repository_1.FirebaseColumnRepository,
        firebase_task_repository_1.FirebaseTaskRepository,
        firebase_commentAndFile_repo_1.FirebaseCommentRepository,
        firebase_commentAndFile_repo_1.FirebaseFileRepository,
        firebase_viewTask_repository_1.FirebaseTaskViewRepository,
        firebase_user_repository_1.FirebaseUserRepository])
], BoardsService);
//# sourceMappingURL=board.service.js.map