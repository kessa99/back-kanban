import { Module } from '@nestjs/common';
import { BoardController } from '../../interface/controller/boardController/borads.controller';
import { BoardsService } from '../../interface/service/board.service';
import { AuthModule } from './auth.module';
import { TeamModule } from './team.module';
import { FirebaseBoardRepository } from '../../infrastructure/repositories/firebase-board.repository';
import { FirebaseTeamRepository } from '../../infrastructure/repositories/firebase-team.repository';
import { FirebaseTaskViewRepository } from '../../infrastructure/repositories/firebase-viewTask.repository';
import { FirebaseTaskRepository } from '../../infrastructure/repositories/firebase-task.repository';
import { FirebaseColumnRepository } from '../../infrastructure/repositories/firebase-column.repository';
import { FirebaseCommentRepository, FirebaseFileRepository } from '../../infrastructure/repositories/firebase-commentAndFile.repo';
import { FirebaseUserRepository } from '../../infrastructure/repositories/firebase-user.repository';
import { UserService } from '../../interface/service/user.service';
// import { TaskModule } from './task.module';
// import { BoardModule } from './board.module';

@Module({
    imports: [
        AuthModule,
        TeamModule,
        // TaskModule,
        // BoardModule
    ],
    controllers: [BoardController],
    providers: [
        UserService,
        BoardsService,
        FirebaseBoardRepository,
        FirebaseTeamRepository,
        FirebaseTaskRepository,
        FirebaseColumnRepository,
        FirebaseCommentRepository,
        FirebaseFileRepository,
        FirebaseTaskViewRepository,
        FirebaseUserRepository
    ],
})
export class BoardModule {}