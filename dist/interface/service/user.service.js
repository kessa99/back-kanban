"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const firebase_user_repository_1 = require("../../infrastructure/repositories/firebase-user.repository");
const userTeam_user_entity_1 = require("../../domain/entities/userTeam/userTeam.user.entity");
const constance_role_1 = require("../../utils/constance/constance.role");
const firebase_team_repository_1 = require("../../infrastructure/repositories/firebase-team.repository");
const jwt_1 = require("@nestjs/jwt");
const invitMail_1 = require("../../utils/mailer/invitMail");
const firebaseAdmin = __importStar(require("firebase-admin"));
let UserService = class UserService {
    constructor(userRepository, teamRepository, jwtService) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.jwtService = jwtService;
    }
    async registerUser(registerUser) {
        console.log(registerUser);
        try {
            const userRecord = await firebaseAdmin.auth().createUser({
                displayName: registerUser.name,
                email: registerUser.email,
                password: registerUser.password,
            });
            console.log('User Record:', userRecord);
            return userRecord;
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('User registration failed');
        }
    }
    async createUser(name, email, password, createdBy) {
        console.log('Creating user with createdBy:', createdBy);
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser)
            throw new common_1.HttpException('Email already registered', common_1.HttpStatus.BAD_REQUEST);
        const newUser = await this.userRepository.create(userTeam_user_entity_1.UserEntity.create({
            id: '',
            name,
            email,
            password,
            role: constance_role_1.Role.MEMBER,
            createdBy: createdBy,
            teamId: '',
            otp: '',
            otpExpiresAt: new Date(),
            otpVerified: false,
        }));
        console.log('Created user:', newUser);
        return newUser;
    }
    async verifyInvite(token, userData) {
        const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        const { email, teamId, role, ownerId } = payload;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser)
            throw new common_1.HttpException('Email already registered', common_1.HttpStatus.BAD_REQUEST);
        const newUser = await this.userRepository.create(userTeam_user_entity_1.UserEntity.create({
            id: '',
            name: userData.name,
            email,
            password: userData.password,
            role: role,
            createdBy: ownerId,
            teamId,
            otp: '',
            otpExpiresAt: new Date(),
            otpVerified: false,
        }));
        return newUser;
    }
    async addUserToTeam(userId, teamId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        user.teamId = teamId;
        await this.userRepository.update(user);
    }
    async findUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findUserById(id) {
        return this.userRepository.findById(id);
    }
    async findById(id) {
        return this.userRepository.findById(id);
    }
    async findUsers() {
        return this.userRepository.findUsers();
    }
    async findUsersByCreatedBy(createdBy) {
        return this.userRepository.findUsersByCreatedBy(createdBy);
    }
    async updateUser(id, name, email, password) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        user.name = name;
        user.email = email;
        user.password = password;
        return this.userRepository.update(user);
    }
    async deleteUser(id) {
        await this.userRepository.delete(id);
    }
    async inviteUser(teamId, inviteData, ownerId, role) {
        const owner = await this.userRepository.findById(ownerId);
        if (!owner)
            throw new common_1.NotFoundException(`Owner with ID ${ownerId} not found`);
        if (owner.role !== constance_role_1.Role.OWNER)
            throw new common_1.UnauthorizedException('Only owners can invite users');
        const team = await this.teamRepository.findById(teamId);
        if (!team)
            throw new common_1.NotFoundException(`Team with ID ${teamId} not found`);
        const payload = { email: inviteData.email, teamId, role, ownerId };
        const inviteToken = this.jwtService.sign(payload, { expiresIn: '24h' });
        const verificationLink = `${process.env.FRONTEND_URL}/verify-invite?token=${inviteToken}`;
        await (0, invitMail_1.sendOTPEmail)(inviteData.email, verificationLink);
        return { message: 'User invited successfully' };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_user_repository_1.FirebaseUserRepository,
        firebase_team_repository_1.FirebaseTeamRepository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map