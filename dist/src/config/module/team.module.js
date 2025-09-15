"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModule = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("src/interface/service/team.service");
const team_controller_1 = require("src/interface/controller/teamController/team.controller");
const firebase_team_repository_1 = require("src/infrastructure/repositories/firebase-team.repository");
const user_service_1 = require("src/interface/service/user.service");
const firebase_user_repository_1 = require("src/infrastructure/repositories/firebase-user.repository");
const auth_module_1 = require("./auth.module");
const users_module_1 = require("./users.module");
let TeamModule = class TeamModule {
};
exports.TeamModule = TeamModule;
exports.TeamModule = TeamModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule],
        controllers: [team_controller_1.TeamController],
        providers: [
            team_service_1.TeamService,
            firebase_team_repository_1.FirebaseTeamRepository,
            user_service_1.UserService,
            firebase_user_repository_1.FirebaseUserRepository,
        ],
        exports: [team_service_1.TeamService],
    })
], TeamModule);
//# sourceMappingURL=team.module.js.map