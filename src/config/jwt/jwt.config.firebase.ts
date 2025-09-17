// src/config/jwt/jwt.config.firebase.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor() {
    super();
  }

  async validate(req: any): Promise<any> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header not found');
      }

      const [bearer, token] = authHeader.split(' ');
      
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid authorization format');
      }

      // Verify the Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      return {
        id: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      };
    } catch (error) {
      console.error('Firebase token validation error:', error);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
