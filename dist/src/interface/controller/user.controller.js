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
const user_service_1 = require("src/interface/service/user.service");
const formatRespons_1 = require("src/utils/formatResponse/formatRespons");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
let UserController = class UserController {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async createUser(body, req, res) {
        try {
            console.log('Request user:', req.user);
            console.log('User ID from token:', req.user?.id);
            const createdBy = req.user?.id;
            if (!createdBy) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            const user = await this.userService.createUser(body.name, body.email, body.password, createdBy);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User created successfully", user);
        }
        catch (error) {
            console.error('Create user error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "User creation failed", error);
        }
    }
    async getUserById(id, res) {
        try {
            const user = await this.userService.findUserById(id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User found successfully", user);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "User not found", error);
        }
    }
    async updateUser(id, body, res) {
        try {
            const user = await this.userService.updateUser(id, body.name, body.email, body.password);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User updated successfully", user);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "User update failed", error);
        }
    }
    async getUsers(req, res) {
        try {
            console.log('Request user for getUsers:', req.user);
            console.log('User ID from token:', req.user?.id);
            const createdBy = req.user?.id;
            if (!createdBy) {
                return (0, formatRespons_1.formatResponse)(res, 401, "failed", "User not authenticated", null);
            }
            const users = await this.userService.findUsersByCreatedBy(createdBy);
            console.log('Found users:', users.length);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Users found successfully", users);
        }
        catch (error) {
            console.error('Get users error:', error);
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Users not found", error);
        }
    }
    async deleteUser(id, res) {
        try {
            await this.userService.deleteUser(id);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User deleted successfully", null);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "User deletion failed", error);
        }
    }
    async inviteUser(body, res) {
        try {
            const user = await this.userService.inviteUser(body.teamId, body.inviteData, body.ownerId, body.role);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "User invited successfully", user);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "User invitation failed", error);
        }
    }
    async verifyInvite(token, userData, res) {
        try {
            const user = await this.userService.verifyInvite(token, userData);
            return (0, formatRespons_1.formatResponse)(res, 200, "success", "Invitation approved", user);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, "failed", "Invalid token or expired", {});
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)("invite"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "inviteUser", null);
__decorate([
    (0, common_1.Post)('verify-invite'),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyInvite", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], UserController);
//# sourceMappingURL=user.controller.js.map