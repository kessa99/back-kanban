"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../interface/service/auth.service");
const auth_controller_1 = require("../../interface/controller/authController/auth.controller");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_1 = require("../../config/jwt/jwt.config");
const jwt_config_firebase_1 = require("../../config/jwt/jwt.config.firebase");
const firebase_user_repository_1 = require("../../infrastructure/repositories/firebase-user.repository");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_config_1.JwtConfigService, jwt_config_firebase_1.FirebaseStrategy, firebase_user_repository_1.FirebaseUserRepository],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map