"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardModule = void 0;
const common_1 = require("@nestjs/common");
const borads_controller_1 = require("../../interface/controller/boardController/borads.controller");
const board_service_1 = require("../../interface/service/board.service");
const auth_module_1 = require("./auth.module");
const team_module_1 = require("./team.module");
const firebase_board_repository_1 = require("../../infrastructure/repositories/firebase-board.repository");
const firebase_team_repository_1 = require("../../infrastructure/repositories/firebase-team.repository");
const firebase_viewTask_repository_1 = require("../../infrastructure/repositories/firebase-viewTask.repository");
const firebase_task_repository_1 = require("../../infrastructure/repositories/firebase-task.repository");
const firebase_column_repository_1 = require("../../infrastructure/repositories/firebase-column.repository");
const firebase_commentAndFile_repo_1 = require("../../infrastructure/repositories/firebase-commentAndFile.repo");
const firebase_user_repository_1 = require("../../infrastructure/repositories/firebase-user.repository");
const user_service_1 = require("../../interface/service/user.service");
let BoardModule = class BoardModule {
};
exports.BoardModule = BoardModule;
exports.BoardModule = BoardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            team_module_1.TeamModule,
        ],
        controllers: [borads_controller_1.BoardController],
        providers: [
            user_service_1.UserService,
            board_service_1.BoardsService,
            firebase_board_repository_1.FirebaseBoardRepository,
            firebase_team_repository_1.FirebaseTeamRepository,
            firebase_task_repository_1.FirebaseTaskRepository,
            firebase_column_repository_1.FirebaseColumnRepository,
            firebase_commentAndFile_repo_1.FirebaseCommentRepository,
            firebase_commentAndFile_repo_1.FirebaseFileRepository,
            firebase_viewTask_repository_1.FirebaseTaskViewRepository,
            firebase_user_repository_1.FirebaseUserRepository
        ],
    })
], BoardModule);
//# sourceMappingURL=boards.module.js.map