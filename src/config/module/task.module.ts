// src/config/module/task.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from '../../interface/service/task.service';
import { TasksController } from '../../interface/controller/taskController/task.controller';
import { FirebaseTaskRepository } from '../../infrastructure/repositories/firebase-task.repository';
import { FireStoreProvider } from '../provider/fireStoreProvider';


@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    FirebaseTaskRepository,
    FireStoreProvider,
  ],
  exports: [
    TasksService,
    FirebaseTaskRepository,
  ],
})
export class TaskModule {}