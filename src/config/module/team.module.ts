import { Module } from '@nestjs/common';
import { TeamService } from '../../interface/service/team.service';
import { TeamController } from '../../interface/controller/teamController/team.controller';
import { FirebaseTeamRepository } from '../../infrastructure/repositories/firebase-team.repository';
import { UserService } from '../../interface/service/user.service';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [TeamController],
  providers: [
    TeamService,
    FirebaseTeamRepository,
    UserService,
    FirebaseUserRepository,
  ],
  exports: [TeamService],
})
export class TeamModule {}