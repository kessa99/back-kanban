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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const userTeam_user_entity_1 = require("../../domain/entities/userTeam/userTeam.user.entity");
const firebase_user_repository_1 = require("../../infrastructure/repositories/firebase-user.repository");
const constance_role_1 = require("../../utils/constance/constance.role");
const otpMailer_1 = require("../../utils/mailer/otpMailer");
const axios_1 = __importDefault(require("axios"));
const firebaseAdmin = __importStar(require("firebase-admin"));
let AuthService = class AuthService {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.otpStore = new Map();
    }
    async loginUser(payload) {
        const { email, password } = payload;
        try {
            const { idToken, refreshToken, expiresIn } = await this.signInWithEmailAndPassword(email, password);
            return { idToken, refreshToken, expiresIn };
        }
        catch (error) {
            if (error.message.includes('EMAIL_NOT_FOUND')) {
                throw new Error('User not found.');
            }
            else if (error.message.includes('INVALID_PASSWORD')) {
                throw new Error('Invalid password.');
            }
            else {
                throw new Error(error.message);
            }
        }
    }
    async signInWithEmailAndPassword(email, password) {
        console.log('Firebase API Key:', process.env.FIREBASE_WEB_API_KEY);
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBNd9QVXQ6AoNqY5U0HxdTWqlC3gIn6hG4
`;
        return await this.sendPostRequest(url, {
            email,
            password,
            returnSecureToken: true,
        });
    }
    async sendPostRequest(url, data) {
        try {
            const response = await axios_1.default.post(url, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        }
        catch (error) {
            console.log('error', error);
        }
    }
    async validateRequest(req) {
        const authHeader = req.headers['Authorization'];
        if (!authHeader) {
            console.log('Authorization header not provided.');
            return false;
        }
        const [bearer, token] = authHeader.split('Bearer ');
        if (bearer !== 'Bearer' && !token) {
            console.log('Invalid authorization format. Expected "Bearer <token>".');
            return false;
        }
        try {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
            console.log('Decoded Token:', decodedToken);
            return true;
        }
        catch (error) {
            if (error.code === 'auth/id-token-expired') {
                console.error('Token has expired.');
            }
            else if (error.code === 'auth/invalid-id-token') {
                console.error('Invalid ID token provided.');
            }
            else {
                console.error('Error verifying token:', error);
            }
            return false;
        }
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async verifyOTP(email, otp) {
        const storedOTP = this.otpStore.get(email);
        if (!storedOTP) {
            throw new common_1.UnauthorizedException('No otp found for this email, please resend otp');
        }
        ;
        if (storedOTP.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('OTP expired, please resend otp');
        }
        ;
        if (storedOTP.otp !== otp) {
            throw new common_1.UnauthorizedException('Invalid otp, please resend otp');
        }
        ;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found, please register');
        }
        ;
        await this.userRepository.update(userTeam_user_entity_1.UserEntity.create({
            ...user,
            otpVerified: true,
            otp: '',
            otpExpiresAt: new Date(),
        }));
        this.otpStore.delete(email);
        return true;
    }
    async sendOTP(email, otp) {
        await (0, otpMailer_1.sendOTPEmail)(email, otp);
    }
    async resendOtp(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found, please register first');
        }
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        this.otpStore.set(email, { otp, expiresAt });
        await this.userRepository.update(userTeam_user_entity_1.UserEntity.create({
            ...user,
            otp: otp,
            otpExpiresAt: expiresAt,
            otpVerified: false,
        }));
        await this.sendOTP(email, otp);
        return 'OTP resent successfully';
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password credentials');
        }
        return user;
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.otpVerified)
            throw new common_1.UnauthorizedException('OTP not verified, please verify your otp');
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            teamId: user.teamId || '',
            otpVerified: user.otpVerified,
        };
        return { access_token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
    }
    async register(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        this.otpStore.set(user.email, { otp, expiresAt });
        await this.sendOTP(user.email, otp);
        const newUser = await this.userRepository.create(userTeam_user_entity_1.UserEntity.create({
            id: '',
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role: constance_role_1.Role.OWNER,
            teamId: user.teamId || '',
            createdBy: user.createdBy || '',
            otp: otp,
            otpExpiresAt: expiresAt,
            otpVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        const payload = {
            email: newUser.email,
            sub: newUser.id,
            role: newUser.role,
            teamId: newUser.teamId,
        };
        const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
        return { user: newUser, access_token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        firebase_user_repository_1.FirebaseUserRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map