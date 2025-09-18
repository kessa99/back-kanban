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
const auth_service_1 = require("../../../interface/service/auth.service");
const formatRespons_1 = require("../../../utils/formatResponse/formatRespons");
const register_dto_1 = require("../../../utils/dto/users/register.dto");
const user_service_1 = require("../../service/user.service");
const login_dta_1 = require("../../../utils/dto/users/login.dta");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async registerUser(registerUserDTo, res) {
        const newUser = await this.userService.registerUser(registerUserDTo);
        return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'User registered successfully', newUser);
    }
    async loginFirebase(loginDto, res) {
        const token = await this.authService.loginUser(loginDto);
        console.log('-------------------------------------------------------------------');
        console.log('User logged in successfully');
        return (0, formatRespons_1.formatResponse)(res, 200, 'success', 'User logged in successfully', token);
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
    (0, common_1.Post)('register-test'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dta_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginFirebase", null);
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
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map