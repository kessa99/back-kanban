// src/config/module/task.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from '../../interface/service/task.service';
import { TasksController } from '../../interface/controller/taskController/task.controller';
import { TeamTasksController } from '../../interface/controller/taskController/team-tasks.controller';
import { TeamTasksService } from '../../interface/service/team-tasks.service';
import { FirebaseTaskRepository } from '../../infrastructure/repositories/firebase-task.repository';
import { FireStoreProvider } from '../provider/fireStoreProvider';


@Module({
  controllers: [TasksController, TeamTasksController],
  providers: [
    TasksService,
    TeamTasksService,
    FirebaseTaskRepository,
    FireStoreProvider,
  ],
  exports: [
    TasksService,
    TeamTasksService,
    FirebaseTaskRepository,
  ],
})
export class TaskModule {}