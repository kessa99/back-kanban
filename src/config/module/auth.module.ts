/**
 * `Auth.Module` est le module de configuration de l'application.
 * charge depuis le .env
 * charge le token expire après 1 heure
 * exporte le module pour que UserModule puisse l'utiliser
*/

import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from '../../interface/service/auth.service';
import { AuthController } from '../../interface/controller/authController/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../../config/jwt/jwt.config';
import { FirebaseStrategy } from '../../config/jwt/jwt.config.firebase';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtConfigService, FirebaseStrategy, FirebaseUserRepository],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}