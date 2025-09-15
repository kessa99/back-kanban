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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("src/interface/service/auth.service");
const userTeam_user_entity_1 = require("src/domain/entities/userTeam/userTeam.user.entity");
const formatRespons_1 = require("src/utils/formatResponse/formatRespons");
const constance_role_1 = require("src/utils/constance/constance.role");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        };
    }
    async register(user, res) {
        try {
            console.log('Registering user:', user.email);
            const newUser = await this.authService.register(userTeam_user_entity_1.UserEntity.create({
                id: '',
                name: user.name,
                email: user.email,
                role: constance_role_1.Role.OWNER,
                teamId: '',
                createdBy: '',
                otp: '',
                otpExpiresAt: new Date(),
                otpVerified: false,
                password: user.password,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            console.log('User created successfully:', newUser.user.id);
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'User created successfully', newUser);
        }
        catch (error) {
            console.error('Registration error:', error);
            if (error.message && (error.message.includes('email') || error.message.includes('OTP'))) {
                return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'User created successfully, but OTP email failed to send. Please try resending OTP.', {
                    user: null,
                    access_token: null,
                    emailSent: false
                });
            }
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'User creation failed', error);
        }
    }
    async verifyOtp(user, res) {
        try {
            const isVerified = await this.authService.verifyOTP(user.email, user.otp);
            console.log('OTP verification result:', isVerified);
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'OTP verified successfully', isVerified);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'OTP verification failed', error);
        }
    }
    async resendOtp(user, res) {
        try {
            const otp = await this.authService.resendOtp(user.email);
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'OTP resent successfully', otp);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'OTP resend failed', error);
        }
    }
    async login(user, res) {
        try {
            const token = await this.authService.login(user.email, user.password);
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'User logged in successfully', token);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'User login failed', error);
        }
    }
    async logout(res) {
        try {
            return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'User logged out successfully', null);
        }
        catch (error) {
            return (0, formatRespons_1.formatResponse)(res, 400, 'failed', 'User logout failed', error);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map