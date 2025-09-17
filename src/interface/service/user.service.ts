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
import { firestore } from "../../config/firebase/firebase.config";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: FirebaseUserRepository,
    private readonly teamRepository: FirebaseTeamRepository,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(registerUser: RegisterUserDto) {
    try {

      // Création dans Firebase Auth
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.name,
        email: registerUser.email,
        password: registerUser.password,
      });

  
      // Création dans Firestore
      const newUser = await firestore.collection('users').doc(userRecord.uid).set({
        name: registerUser.name,
        email: registerUser.email,
        password: registerUser.password,
        createdBy: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('-------------------------------------------------------------------');
      console.log('User enregistrer avec succès dans le service');
  
      // Retour simplifié
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`User registration failed: ${error.message}`);
    }
  }
  
  
  async createUser(createUserDto: RegisterUserDto, createdBy: string): Promise<UserEntity> {
    console.log('Creating user with createdBy:', createdBy);
    
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    
    const userRecord = await firebaseAdmin.auth().createUser({
      displayName: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    await firestore.collection('users').doc(userRecord.uid).set({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      createdBy: createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Create and return a UserEntity object
    const newUser = UserEntity.create({
      id: userRecord.uid,
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      createdBy: createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('-------------------------------------------------------------------');
    console.log('User created with succès dans le service');
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
        createdBy: ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
    return newUser;
  }


  async addUserToTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    user.createdBy = teamId;
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

  async updateUser(id: string, updateData: { name?: string, email?: string, password?: string }): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.name = updateData.name || user.name;
    user.email = updateData.email || user.email;
    user.password = updateData.password || user.password;

    const updatedUser = await this.userRepository.update(user);
    console.log('-------------------------------------------------------------------');
    console.log('User updated with succès dans le service');
    console.log('-------------------------------------------------------------------')
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    // firebaseAdmin delete
    await firebaseAdmin.auth().deleteUser(id);
    await this.userRepository.delete(id);
  }

  async inviteUser(teamId: string, inviteData: { email: string }, ownerId: string, role: string): Promise<{ message: string }> {
    const owner = await this.userRepository.findById(ownerId);
    if (!owner) throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    // if (owner.role !== Role.OWNER) throw new UnauthorizedException('Only owners can invite users');

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