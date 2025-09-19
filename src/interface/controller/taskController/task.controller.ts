// src/modules/tasks/tasks.controller.ts
import { Controller, Post, Get, Patch, Param, Body, Request, Res, HttpStatus, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { FirebaseTaskRepository } from '../../../infrastructure/repositories/firebase-task.repository';
import { KanbanTaskEntity } from '../../../domain/entities/kanban/kanban.task.entity';
import { Status } from '../../../utils/constance/constance.status';
import { Priority } from '../../../utils/constance/constance.priority';
import { UserEntity } from '../../../domain/entities/userTeam/userTeam.user.entity';
import { formatResponse } from '../../../utils/formatResponse/formatRespons';
import { BoardsService } from '../../../interface/service/board.service';
import { UserService } from '../../../interface/service/user.service';
import { FirebaseUserRepository } from '../../../infrastructure/repositories/firebase-user.repository';

import { TasksService } from '../../service/task.service';
import { CreateTaskDto } from '../../../utils/dto/task.dto';
import { FirebaseAuthGuard } from '../../../config/jwt/firebase-auth.guard';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';


@Controller('boards/:boardId/tasks')
@UseGuards(FirebaseAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @Request() req,
    @Res() res: Response,
    @Param('boardId') boardId: string,
    // @Param('columnId') columnId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userId = req.user.id
    console.log('columnId', createTaskDto.columnId)
    console.log('payload', createTaskDto)
    const task = await this.tasksService.createTask(boardId, createTaskDto.columnId, createTaskDto, userId);
    console.log('----------------------------------------------------------------')
    console.log(task)
    console.log('----------------------------------------------------------------')
    return formatResponse(res, 201, "success", "Task created successfully", task);
  }

  // get all tasks for a board
  // @Get()
  // async getAllTasks(
  //   @Res() res: Response,
  //   @Param('boardId') boardId: string,
  // ) {
  //   console.log('----------------------------------------------------------------')
  //   console.log('boardId', boardId)
  //   console.log('----------------------------------------------------------------')
  //   // const tasks = await this.tasksService.getTasksByBoardId(boardId);
  //   // return formatResponse(res, 200, "success", "Tasks retrieved successfully", tasks);
  // }
  
  // get a task by id
  @Get(':taskId')
  async getTaskById(
    @Res() res: Response,
    @Param('taskId') taskId: string,
  ) {
    const task = await this.tasksService.findTaskById(taskId);
    return formatResponse(res, 200, "success", "Task retrieved successfully", task);
  }

  @Patch('checklists/:checklistId/assign')
  async addAssignedToChecklist(
    @Res() res: Response,
    @Param('checklistId') checklistId: string,
    @Body('assignedTo') assignedTo: string,
  ) {
    console.log('----------------------------------------------------------------')
    console.log('assignedTo', assignedTo)
    console.log('checklistId', checklistId)
    console.log('----------------------------------------------------------------')
    const checklist = await this.tasksService.addAssignedToChecklist(checklistId, assignedTo);
    return formatResponse(res, 200, "success", "Assigned to checklist successfully", checklist);
  }

  @Patch('checklists/:checklistId/unassign')
  async removeAssignedToChecklist(
    @Param('checklistId') checklistId: string,
    @Res() res: Response
  ) {
    console.log('----------------------------------------------------------------')
    console.log('checklistId', checklistId)
    console.log('----------------------------------------------------------------')
    const checklist = await this.tasksService.removeAssignedToChecklist(checklistId);
    return formatResponse(res, 200, "success", "Unassigned from checklist successfully", checklist);
  }
}