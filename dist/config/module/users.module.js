"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const firebase_user_repository_1 = require("../../infrastructure/repositories/firebase-user.repository");
const firebase_team_repository_1 = require("../../infrastructure/repositories/firebase-team.repository");
const auth_module_1 = require("src/config/module/auth.module");
const user_controller_1 = require("src/interface/controller/user.controller");
const user_service_1 = require("src/interface/service/user.service");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, firebase_user_repository_1.FirebaseUserRepository, firebase_team_repository_1.FirebaseTeamRepository],
        exports: [user_service_1.UserService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map