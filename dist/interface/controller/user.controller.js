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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../interface/service/user.service");
const formatRespons_1 = require("../../utils/formatResponse/formatRespons");
const jwt_1 = require("@nestjs/jwt");
const firebase_auth_guard_1 = require("../../config/jwt/firebase-auth.guard");
const register_dto_1 = require("../../utils/dto/users/register.dto");
const UpdateFcmDto_1 = require("../../utils/dto/users/UpdateFcmDto");
let UserController = class UserController {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async updateFcmToken(updateFcmDto, req, res) {
        try {
            const userId = req.user?.id;
            console.log('-------------------------------------------------------------------');
            console.log('User ID from token:', req.user?.id);
            console.log('-------------------------------------------------------------------');
            const token = this.userService.updateFcmToken(userId, updateFcmDto);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Token FCM mis à jour", token);
        }
        catch (error) {
            console.error('Update fcm token error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Failed to update fcm token", error);
        }
    }
    async createUser(registerUserDto, req, res) {
        try {
            const createdBy = req.user?.id;
            console.log('-------------------------------------------------------------------');
            console.log('User ID from token:', req.user?.id);
            console.log('-------------------------------------------------------------------');
            if (!createdBy) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            const user = await this.userService.createUser(registerUserDto, createdBy);
            console.log('-------------------------------------------------------------------');
            console.log('User created with succès dans le controller');
            console.log('-------------------------------------------------------------------');
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User created successfully", user);
        }
        catch (error) {
            console.error('Create user error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "User creation failed", error);
        }
    }
    async findAllUsers(req, res) {
        try {
            const createdBy = req.user?.id;
            if (!createdBy) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            const users = await this.userService.findUsersByCreatedBy(createdBy);
            console.log('-------------------------------------------------------------------');
            console.log('Users retrieved with succès dans le controller');
            console.log('-------------------------------------------------------------------');
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Users retrieved successfully", users);
        }
        catch (error) {
            console.error('Find all users error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Failed to retrieve users", error);
        }
    }
    async findOneUser(id, req, res) {
        try {
            const createdBy = req.user?.id;
            if (!createdBy) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            const user = await this.userService.findById(id);
            console.log('-------------------------------------------------------------------');
            console.log('User retrieved with succès dans le controller');
            console.log('-------------------------------------------------------------------');
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User retrieved successfully", user);
        }
        catch (error) {
            console.error('Find one user error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Failed to retrieve user", error);
        }
    }
    async updateUser(id, updateUserDto, req, res) {
        try {
            const createdBy = req.user?.id;
            if (!createdBy) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            const user = await this.userService.updateUser(id, updateUserDto);
            console.log('-------------------------------------------------------------------');
            console.log('==> User updated with succès dans le controller');
            console.log('-------------------------------------------------------------------');
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User updated successfully", user);
        }
        catch (error) {
            console.error('Update user error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Failed to update user", error);
        }
    }
    async removeUser(id, req, res) {
        try {
            const createdBy = req.user?.id;
            if (!createdBy) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            await this.userService.deleteUser(id);
            console.log('-------------------------------------------------------------------');
            console.log('User deleted with succès dans le controller');
            console.log('-------------------------------------------------------------------');
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User deleted successfully", null);
        }
        catch (error) {
            console.error('Remove user error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Failed to delete user", error);
        }
    }
    async getTasks(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            console.log('-------------------------------------------------------------------');
            console.log('Tasks retrieved with succès dans le controller');
            console.log('-------------------------------------------------------------------');
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Tasks retrieved successfully", null);
        }
        catch (error) {
            console.error('Get tasks error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Failed to retrieve tasks", error);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Patch)('fcm'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateFcmDto_1.UpdateFcmDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateFcmToken", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOneUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeUser", null);
__decorate([
    (0, common_1.Get)('tasks'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTasks", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], UserController);
//# sourceMappingURL=user.controller.js.map