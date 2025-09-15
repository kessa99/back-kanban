import { Module } from '@nestjs/common';
import { TeamService } from 'src/interface/service/team.service';
import { TeamController } from 'src/interface/controller/teamController/team.controller';
import { FirebaseTeamRepository } from 'src/infrastructure/repositories/firebase-team.repository';
import { UserService } from 'src/interface/service/user.service';
import { FirebaseUserRepository } from 'src/infrastructure/repositories/firebase-user.repository';
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