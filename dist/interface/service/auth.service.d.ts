import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../domain/entities/userTeam/userTeam.user.entity';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepository;
    private otpStore;
    constructor(jwtService: JwtService, userRepository: FirebaseUserRepository);
    private generateOTP;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    private sendOTP;
    resendOtp(email: string): Promise<string>;
    validateUser(email: string, password: string): Promise<UserEntity | null>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
    register(user: UserEntity): Promise<{
        user: UserEntity;
        access_token: string;
    }>;
}
