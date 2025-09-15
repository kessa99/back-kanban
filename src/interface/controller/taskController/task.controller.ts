// src/modules/tasks/tasks.controller.ts
import { Controller, Post, Get, Patch, Param, Body, Request, Res, HttpStatus, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { FirebaseTaskRepository } from '../../../infrastructure/repositories/firebase-task.repository';
import { KanbanTaskEntity } from '../../../domain/entities/kanban/kanban.task.entity';
import { KanbanChecklistEntity } from '../../../domain/entities/kanban/kanban.checkList.entity';
import { Status } from '../../../utils/constance/constance.status';
import { Priority } from '../../../utils/constance/constance.priority';
import { UserEntity } from '../../../domain/entities/userTeam/userTeam.user.entity';
import { formatResponse } from '../../../utils/formatResponse/formatRespons';
import { BoardsService } from '../../../interface/service/board.service';
import { UserService } from '../../../interface/service/user.service';
import { FirebaseUserRepository } from '../../../infrastructure/repositories/firebase-user.repository';

@Controller('task-board')
export class TasksController {
  constructor(
    private readonly taskRepository: FirebaseTaskRepository,
    private readonly userRepository: FirebaseUserRepository,
    private readonly boardsService: BoardsService,
    private readonly userService: UserService,
  ) {}

  
}