/**
 * @description JWT configuration\
 * elle est utilisée pour configurer le JWT
 * elle est utilisée pour extraire le token du header
 * elle est utilisée pour ignorer l'expiration du token
 * elle est utilisée pour vérifier si le token est valide
 * elle est utilisée pour récupérer les informations de l'utilisateur à partir du token
 * elle est utilisée pour vérifier si l'utilisateur a les permissions nécessaires pour accéder à la route
 * elle est utilisée pour vérifier si l'utilisateur est authentifié
 * elle est utilisée pour vérifier si l'utilisateur est autorisé à accéder à la route
 * elle est utilisée pour vérifier si l'utilisateur est autorisé à accéder à la route
 */


import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role,
      teamId: payload.teamId,
      otpVerified: payload.otpVerified,
    };
  }
}