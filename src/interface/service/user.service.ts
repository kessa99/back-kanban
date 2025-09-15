/*
    UserService is a service that handles the user data.
    It is used to create, find, update and delete users.
    It is used to handle the user data.
    It is used to handle the user data.
*/

import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FirebaseUserRepository } from "../../infrastructure/repositories/firebase-user.repository";
import { UserEntity } from "../../domain/entities/userTeam/userTeam.user.entity";
import { Role } from "../../utils/constance/constance.role";
import { FirebaseTeamRepository } from "../../infrastructure/repositories/firebase-team.repository";
import { JwtService } from '@nestjs/jwt';
import { sendOTPEmail } from "../../utils/mailer/invitMail";
import { RegisterUserDto } from "../../utils/dto/users/register.dto";
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: FirebaseUserRepository,
    private readonly teamRepository: FirebaseTeamRepository,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(registerUser: RegisterUserDto) {
    console.log(registerUser);
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.name,
        email: registerUser.email,
        password: registerUser.password,        
      });
      console.log('User Record:', userRecord);
      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User registration failed'); // Handle errors gracefully
    }
  }
  
  async createUser(name: string, email: string, password: string, createdBy: string): Promise<UserEntity> {
    console.log('Creating user with createdBy:', createdBy); // Debug log
    
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    
    const newUser = await this.userRepository.create(
      UserEntity.create({
        id: '',
        name,
        email,
        password,
        role: Role.MEMBER,
        createdBy: createdBy,
        teamId: '',
        otp: '',
        otpExpiresAt: new Date(),
        otpVerified: false,
      })
    );
    
    console.log('Created user:', newUser); // Debug log
    return newUser;
  }

  async verifyInvite(token: string, userData: { name: string; password: string }): Promise<UserEntity> {
    const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    const { email, teamId, role, ownerId } = payload;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);

    const newUser = await this.userRepository.create(
      UserEntity.create({
        id: '',
      name: userData.name,
      email,
      password: userData.password,
      role: role as Role,
        createdBy: ownerId,
      teamId,
      otp: '',
      otpExpiresAt: new Date(),
      otpVerified: false,
      })
    );
    return newUser;
  }


  async addUserToTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    user.teamId = teamId;
    await this.userRepository.update(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async findUsers(): Promise<UserEntity[]> {
    return this.userRepository.findUsers();
  }

  async findUsersByCreatedBy(createdBy: string): Promise<UserEntity[]> {
    return this.userRepository.findUsersByCreatedBy(createdBy);
  }

  async updateUser(id: string, name: string, email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.name = name;
    user.email = email;
    user.password = password;

    return this.userRepository.update(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async inviteUser(teamId: string, inviteData: { email: string }, ownerId: string, role: string): Promise<{ message: string }> {
    const owner = await this.userRepository.findById(ownerId);
    if (!owner) throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    if (owner.role !== Role.OWNER) throw new UnauthorizedException('Only owners can invite users');

    // Vérifie si l'équipe existe
    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new NotFoundException(`Team with ID ${teamId} not found`);

    // Génère un token d'invitation
    const payload = { email: inviteData.email, teamId, role, ownerId };
    const inviteToken = this.jwtService.sign(payload, { expiresIn: '24h' });

    // Crée un lien d'invitation
    const verificationLink = `${process.env.FRONTEND_URL}/verify-invite?token=${inviteToken}`;

    // Envoie l'email avec le lien
    await sendOTPEmail(inviteData.email, verificationLink);

    return { message: 'User invited successfully' };
  }
}