import { Module } from '@nestjs/common';
import { BoardController } from 'src/interface/controller/boardController/borads.controller';
import { BoardsService } from 'src/interface/service/board.service';
import { AuthModule } from './auth.module';
import { TeamModule } from './team.module';
import { FirebaseBoardRepository } from 'src/infrastructure/repositories/firebase-board.repository';
import { FirebaseTeamRepository } from 'src/infrastructure/repositories/firebase-team.repository';
import { FirebaseTaskViewRepository } from 'src/infrastructure/repositories/firebase-viewTask.repository';
import { FirebaseTaskRepository } from 'src/infrastructure/repositories/firebase-task.repository';
import { FirebaseColumnRepository } from 'src/infrastructure/repositories/firebase-column.repository';
import { FirebaseCommentRepository, FirebaseFileRepository } from 'src/infrastructure/repositories/firebase-commentAndFile.repo';
import { FirebaseUserRepository } from 'src/infrastructure/repositories/firebase-user.repository';
import { UserService } from 'src/interface/service/user.service';
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