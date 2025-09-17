import { FirebaseUserRepository } from "../../infrastructure/repositories/firebase-user.repository";
import { UserEntity } from "../../domain/entities/userTeam/userTeam.user.entity";
import { FirebaseTeamRepository } from "../../infrastructure/repositories/firebase-team.repository";
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from "../../utils/dto/users/register.dto";
import * as firebaseAdmin from 'firebase-admin';
export declare class UserService {
    private readonly userRepository;
    private readonly teamRepository;
    private readonly jwtService;
    constructor(userRepository: FirebaseUserRepository, teamRepository: FirebaseTeamRepository, jwtService: JwtService);
    registerUser(registerUser: RegisterUserDto): Promise<firebaseAdmin.firestore.WriteResult>;
    createUser(createUserDto: RegisterUserDto, createdBy: string): Promise<UserEntity>;
    verifyInvite(token: string, userData: {
        name: string;
        password: string;
    }): Promise<UserEntity>;
    addUserToTeam(userId: string, teamId: string): Promise<void>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    findUserById(id: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    findUsers(): Promise<UserEntity[]>;
    findUsersByCreatedBy(createdBy: string): Promise<UserEntity[]>;
    updateUser(id: string, updateData: {
        name?: string;
        email?: string;
        password?: string;
    }): Promise<UserEntity>;
    deleteUser(id: string): Promise<void>;
    inviteUser(teamId: string, inviteData: {
        email: string;
    }, ownerId: string, role: string): Promise<{
        message: string;
    }>;
}
