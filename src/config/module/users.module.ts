/**
 * `Users.Module` est le module de configuration de l'application.
 * importe AuthModule pour utiliser JwtAuthGuard
 * exporte le module pour que UserModule puisse l'utiliser
*/

import { Module } from '@nestjs/common';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
import { FirebaseTeamRepository } from '../../infrastructure/repositories/firebase-team.repository';
import { AuthModule } from 'src/config/module/auth.module';
import { UserController } from 'src/interface/controller/user.controller';
import { UserService } from 'src/interface/service/user.service';
import { HealthController } from 'src/interface/controller/heath.controller';

@Module({
  imports: [AuthModule], // Importe AuthModule pour utiliser JwtAuthGuard
  controllers: [UserController, HealthController],
  providers: [UserService, FirebaseUserRepository, FirebaseTeamRepository],
  exports: [UserService], // Exporte pour réutilisation
})
export class UsersModule {}