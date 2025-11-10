/**
 * Service d'authentification pour gérer l'inscription, la connexion et la validation des utilisateurs.
 * Ce service utilise Firebase comme backend pour stocker les informations des utilisateurs et bcrypt pour hacher
 * et comparer les mots de passe de manière sécurisée. Il génère également des tokens JWT pour les sessions
 * authentifiées. Il dépend du FirebaseUserRepository pour accéder aux données et du JwtService pour la gestion
 * des tokens. Les principales fonctionnalités incluent :
 * - Validation des identifiants (email et mot de passe) stockés dans Firestore.
 * - Inscription d'un nouvel utilisateur avec hachage du mot de passe.
 * - Connexion avec génération d'un token JWT pour les sessions sécurisées.
 */

import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../../domain/entities/userTeam/userTeam.user.entity';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
import { Role } from '../../utils/constance/constance.role';
import { sendOTPEmail } from '../../utils/mailer/otpMailer';
import { LoginDto } from '../../utils/dto/users/login.dta';
import axios from 'axios';
import * as firebaseAdmin from 'firebase-admin';
import { UpdateFcmDto } from '../../utils/dto/users/UpdateFcmDto';
import { sendOTPEmailBrevo } from '../../utils/mailer/otpMailer';
import { sendOTPEmailEtheral } from '../../utils/mailer/otpMailer';
import { BrevoMailer } from '../../config/configMail/brevoMailer';
import { IsEmail } from 'class-validator';
import { RegisterUserDto } from '../../utils/dto/users/register.dto';

@Injectable()
export class AuthService {
  private otpStore = new Map<string, { otp: string, expiresAt: Date }>();

  constructor(
    private readonly jwtService: JwtService, 
    private readonly userRepository: FirebaseUserRepository,
  ) {}


  async loginUser(payload: LoginDto) {
    const { email, password } = payload;
    try {
      const { idToken, refreshToken, expiresIn } = await this.signInWithEmailAndPassword(email, password);
      return { idToken, refreshToken, expiresIn };
    } catch (error: any) {
      const firebaseError = error.response?.data?.error?.message;
  
      switch (firebaseError) {
        case 'EMAIL_NOT_FOUND':
          throw new Error('User not found.');
        case 'INVALID_PASSWORD':
          throw new Error('Invalid password.');
        case 'USER_DISABLED':
          throw new Error('This account has been disabled.');
        default:
          throw new Error(firebaseError || 'Authentication failed.');
      }
    }
  }
  
      
  private async signInWithEmailAndPassword(email: string, password: string) {
  const apiKey = process.env.FIREBASE_WEB_API_KEY; // Make sure this is set in your .env
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBNd9QVXQ6AoNqY5U0HxdTWqlC3gIn6hG4`;
        
  return await this.sendPostRequest(url,
    {
      email,
      password,
      returnSecureToken: true,
    }); 
  }
  
  private async sendPostRequest(url: string, data: any) {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  }

  async validateRequest(req: Request): Promise<boolean> {
    const authHeader = req.headers['authorization'];
        
    if (!authHeader) {
      console.log('Authorization header not provided.');
      return false;
    }
    
    const [bearer, token] = authHeader.split(' ');
        
    if (bearer !== 'Bearer' || !token) {
      console.log('Invalid authorization format. Expected "Bearer <token>".');
      return false;
    }
    
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      console.log('Decoded Token:', decodedToken);
          
      // Add user info to request for the controller to use
      (req as any).user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      };
          
      return true;
    } catch (error) {
      if (error.code === 'auth/id-token-expired') {
        console.error('Token has expired.');
      } else if (error.code === 'auth/invalid-id-token') {
        console.error('Invalid ID token provided.');
      } else {
        console.error('Error verifying token:', error);
      }
        return false;
    }
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = this.otpStore.get(email);
    console.log('storedOTP', storedOTP);

    if (!storedOTP) {
      throw new UnauthorizedException('No otp found for this email, please resend otp');
    };

    if (storedOTP.expiresAt < new Date()) {
      console.log('OTP expired, please resend otp');
      throw new UnauthorizedException('OTP expired, please resend otp');
    };

    console.log('storedOTP', storedOTP);
    console.log('otp', otp);
    if (storedOTP.otp !== otp) {
      throw new UnauthorizedException('Invalid otp, please resend otp');
    };

    const emailVerified = true;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found, please register');
    };

    await this.userRepository.updateVerifyOtp(user.id, emailVerified, otp);

    // delete otp from store
    this.otpStore.delete(email);
    return true;
  }

  private async sendOTP(email: string, otp: string) {
    await sendOTPEmail(email, otp);
  }

  async resendOtp(email: string) {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found, please register first');
    }


    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
        
    // Stocker l'OTP en mémoire
    this.otpStore.set(email, { otp, expiresAt });
        
    // Mettre à jour l'utilisateur dans la base de données
    await this.userRepository.updateOtp(user.id, otp, expiresAt);

    // Envoyer l'OTP par email
    await this.sendOTP(email, otp);
        
    return 'OTP resent successfully';
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    console.log('user', user);
    if (!user) {
      throw new UnauthorizedException('Invalid email credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password credentials');
    }
    return user;
  }

  async login(email: string, password: string) {
    console.log('Login with email:', email);
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.emailVerified) throw new UnauthorizedException('OTP not verified, please verify your otp');
        
    const payload = {
      email: user.email, 
      sub: user.id, 
      role: user.role,
      emailVerified: user.emailVerified,
    };
    console.log('payload', payload);
    console.log('access_token', this.jwtService.sign(payload, { expiresIn: '1h' }));
        
    return { access_token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
  }

  async register(dto: RegisterUserDto) {
    // Vérifier que l'email est unique
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new UnauthorizedException('Email already registered');
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Générer OTP
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    this.otpStore.set(dto.email, { otp, expiresAt });
    
    // Créer l'utilisateur avec OTP et emailVerified
    const newUser = await this.userRepository.create(
      UserEntity.create({
        id: '',
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: Role.OWNER,
        emailVerified: false,
        otp,
        statusInvite: dto.statusInvite || null,
        createdBy: dto.createdBy || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    console.log('User object before sending to Firestore:', newUser);
    
    // Envoyer l'OTP par email
    await this.sendOTP(dto.email, otp);
    
    // Générer JWT
    const payload = { email: newUser.email, sub: newUser.id, role: newUser.role, emailVerified: newUser.emailVerified };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    
    return { user: newUser, access_token };
  }
}