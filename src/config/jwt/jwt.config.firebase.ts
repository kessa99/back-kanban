import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../interface/service/auth.service';

/**
 * Firebase JWT Strategy for Firebase Authentication
 */
@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'firebase', // Firebase handles verification
    });
  }

  async validate(payload: any) {
    try {
        console.log('payload', payload);
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(payload);

      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('decodedToken', decodedToken);
      
      return {  
        id: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        emailVerified: decodedToken.email_verified,
        role: 'owner',
        teamId: '',
        otpVerified: true,
      };
    } catch (error) {
      throw new Error('Invalid Firebase token');
    }
  }
}