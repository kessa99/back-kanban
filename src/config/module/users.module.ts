import { Module, forwardRef } from '@nestjs/common';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
import { FirebaseTeamRepository } from '../../infrastructure/repositories/firebase-team.repository';
import { AuthModule } from '../../config/module/auth.module';
import { UserController } from '../../interface/controller/user.controller';
import { UserService } from '../../interface/service/user.service';
import { HealthController } from '../../interface/controller/heath.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, HealthController],
  providers: [UserService, FirebaseUserRepository, FirebaseTeamRepository],
  exports: [UserService],
})
export class UsersModule {}
