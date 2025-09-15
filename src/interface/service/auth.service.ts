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
          const { idToken, refreshToken, expiresIn } =
            await this.signInWithEmailAndPassword(email, password);
          return { idToken, refreshToken, expiresIn };
        } catch (error: any) {
          if (error.message.includes('EMAIL_NOT_FOUND')) {
            throw new Error('User not found.');
          } else if (error.message.includes('INVALID_PASSWORD')) {
            throw new Error('Invalid password.');
          } else {
            throw new Error(error.message);
          }
        }
      }
      private async signInWithEmailAndPassword(email: string, password: string) {
        console.log('Firebase API Key:', process.env.FIREBASE_WEB_API_KEY);

        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBNd9QVXQ6AoNqY5U0HxdTWqlC3gIn6hG4
`;
        return await this.sendPostRequest(url, {
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
        if (!storedOTP) {
            throw new UnauthorizedException('No otp found for this email, please resend otp');
        };
        if (storedOTP.expiresAt < new Date()) {
            throw new UnauthorizedException('OTP expired, please resend otp');
        };
        if (storedOTP.otp !== otp) {
            throw new UnauthorizedException('Invalid otp, please resend otp');
        };
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found, please register');
        };

        await this.userRepository.update(UserEntity.create({
            ...user,
            otpVerified: true,
            otp: '',
            otpExpiresAt: new Date(),
        }))

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
        await this.userRepository.update(UserEntity.create({
            ...user,
            otp: otp,
            otpExpiresAt: expiresAt,
            otpVerified: false, // Réinitialiser le statut de vérification
        }));

        // Envoyer l'OTP par email
        await this.sendOTP(email, otp);
        
        return 'OTP resent successfully';
    }


    async validateUser(email: string, password: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password credentials'); // Correction de la typo
        }
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (!user.otpVerified) throw new UnauthorizedException('OTP not verified, please verify your otp');
        
        const payload = {
            email: user.email, 
            sub: user.id, 
            role: user.role,
            teamId: user.teamId || '', // Correction: teamId au lieu de teamIds
            otpVerified: user.otpVerified,
        };
        
        return { access_token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
    }

    async register(user: UserEntity) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
        this.otpStore.set(user.email, { otp, expiresAt });
        await this.sendOTP(user.email, otp);

        const newUser = await this.userRepository.create(
            UserEntity.create({
                id: '',
                name: user.name,
                email: user.email,
                password: hashedPassword,
                role: Role.OWNER,
                teamId: user.teamId || '', // S'assurer que teamId est défini
                createdBy: user.createdBy || '', // S'assurer que createdBy est défini
                otp: otp,
                otpExpiresAt: expiresAt,
                otpVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        )
        
        // Generate JWT with the correct user ID from the created user
        const payload = {
            email: newUser.email, 
            sub: newUser.id, 
            role: newUser.role,
            teamId: newUser.teamId,
        };
        const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
        
        return { user: newUser, access_token };
    }
}