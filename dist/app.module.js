"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("./config/module/config.module");
const auth_module_1 = require("./config/module/auth.module");
const users_module_1 = require("./config/module/users.module");
const team_module_1 = require("./config/module/team.module");
const firebase_module_1 = require("./config/module/firebase.module");
const boards_module_1 = require("./config/module/boards.module");
const heath_controller_1 = require("./interface/controller/heath.controller");
const jwtAuth_guard_1 = require("./config/jwt/jwtAuth.guard");
const task_module_1 = require("./config/module/task.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            team_module_1.TeamModule,
            boards_module_1.BoardModule,
            task_module_1.TaskModule,
        ],
        controllers: [heath_controller_1.HealthController],
        providers: [jwtAuth_guard_1.AuthGuardFirebase],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map