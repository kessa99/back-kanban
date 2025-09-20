import { Controller, Get, Request, Res, HttpStatus, UseGuards, Param } from '@nestjs/common';
import type { Response } from 'express';
import { FirebaseAuthGuard } from '../../../config/jwt/firebase-auth.guard';
import { formatResponse } from '../../../utils/formatResponse/formatRespons';
import { TeamTasksService } from '../../service/team-tasks.service';

@Controller('teams')
@UseGuards(FirebaseAuthGuard)
export class TeamTasksController {
  constructor(private readonly teamTasksService: TeamTasksService) {}

  @Get('tasks/assigned')
  async getAssignedTasks(@Request() req, @Res() res: Response) {
    try {
      const userId = req.user.id;
      console.log('Getting assigned tasks for user:', userId);
      
      const assignedTasks = await this.teamTasksService.getAssignedTasksByUserId(userId);
      
      return formatResponse(
        res, 
        HttpStatus.OK, 
        "success", 
        "Assigned tasks retrieved successfully", 
        assignedTasks
      );
    } catch (error) {
      console.error('Error getting assigned tasks:', error);
      return formatResponse(
        res, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "error", 
        "Failed to retrieve assigned tasks", 
        null
      );
    }
  }

  @Get('boards/assigned')
  async getAssignedBoards(@Request() req, @Res() res: Response) {
    try {
      const userId = req.user.id;
      console.log('Getting assigned boards for user:', userId);
      
      const assignedBoards = await this.teamTasksService.getAssignedBoardsByUserId(userId);
      
      return formatResponse(
        res, 
        HttpStatus.OK, 
        "success", 
        "Assigned boards retrieved successfully", 
        assignedBoards
      );
    } catch (error) {
      console.error('Error getting assigned boards:', error);
      return formatResponse(
        res, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "error", 
        "Failed to retrieve assigned boards", 
        null
      );
    }
  }

  @Get('user-teams')
  async getUserTeams(@Request() req, @Res() res: Response) {
    try {
      const userId = req.user.id;
      console.log('Getting teams for user:', userId);
      
      const userTeams = await this.teamTasksService.getUserTeams(userId);
      
      return formatResponse(
        res, 
        HttpStatus.OK, 
        "success", 
        "User teams retrieved successfully", 
        userTeams
      );
    } catch (error) {
      console.error('Error getting user teams:', error);
      return formatResponse(
        res, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "error", 
        "Failed to retrieve user teams", 
        null
      );
    }
  }

  @Get('boards/assigned-by-checklist')
  async getBoardsAssignedByChecklist(@Request() req, @Res() res: Response) {
    try {
      const userId = req.user.id;
      console.log('Getting boards assigned by checklist for user:', userId);
      
      const assignedBoards = await this.teamTasksService.getBoardsAssignedByChecklist(userId);
      
      return formatResponse(
        res, 
        HttpStatus.OK, 
        "success", 
        "Boards assigned by checklist retrieved successfully", 
        assignedBoards
      );
    } catch (error) {
      console.error('Error getting boards assigned by checklist:', error);
      return formatResponse(
        res, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "error", 
        "Failed to retrieve boards assigned by checklist", 
        null
      );
    }
  }

  @Get('checklists/assigned')
  async getAssignedChecklists(@Request() req, @Res() res: Response) {
    try {
      const userId = req.user.id;
      console.log('Getting assigned checklists for user:', userId);
      
      const assignedChecklists = await this.teamTasksService.getAssignedChecklists(userId);
      
      return formatResponse(
        res, 
        HttpStatus.OK, 
        "success", 
        "Assigned checklists retrieved successfully", 
        assignedChecklists
      );
    } catch (error) {
      console.error('Error getting assigned checklists:', error);
      return formatResponse(
        res, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "error", 
        "Failed to retrieve assigned checklists", 
        null
      );
    }
  }

  @Get(':teamId/tasks')
  async getTeamTasks(
    @Request() req, 
    @Res() res: Response,
    @Param('teamId') teamId: string
  ) {
    try {
      const userId = req.user.id;
      console.log('Getting tasks for team:', teamId, 'user:', userId);
      
      // Vérifier que l'utilisateur est membre de l'équipe
      const isMember = await this.teamTasksService.isUserMemberOfTeam(userId, teamId);
      if (!isMember) {
        return formatResponse(
          res, 
          HttpStatus.FORBIDDEN, 
          "error", 
          "You are not a member of this team", 
          null
        );
      }
      
      const teamTasks = await this.teamTasksService.getTasksByTeamId(teamId);
      
      return formatResponse(
        res, 
        HttpStatus.OK, 
        "success", 
        "Team tasks retrieved successfully", 
        teamTasks
      );
    } catch (error) {
      console.error('Error getting team tasks:', error);
      return formatResponse(
        res, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "error", 
        "Failed to retrieve team tasks", 
        null
      );
    }
  }

  @Get(':teamId/boards/:boardId/tasks/assigned')
  async getAssignedTasksForBoard(
    @Request() req, 
    @Res() res: Response,
    @Param('teamId') teamId: string,
    @Param('boardId') boardId: string
  ) {
    try {
      const userId = req.user.id;
      console.log('Getting assigned tasks for board:', boardId, 'team:', teamId, 'user:', userId);
      
      // Vérifier que l'utilisateur est membre de l'équipe
      const isMember = await this.teamTasksService.isUserMemberOfTeam(userId, teamId);
      if (!isMember) {
        return formatResponse(
          res, 
          HttpStatus.FORBIDDEN, 
          "error", 
          "You are not a member of this team", 
          null
        );
      }
      
      const assignedTasks = await this.teamTasksService.getAssignedTasksForBoard(userId, boardId);
      
      return formatResponse(
        res, 
        HttpStatus.OK, 
        "success", 
        "Assigned tasks for board retrieved successfully", 
        assignedTasks
      );
    } catch (error) {
      console.error('Error getting assigned tasks for board:', error);
      return formatResponse(
        res, 
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "error", 
        "Failed to retrieve assigned tasks for board", 
        null
      );
    }
  }
}
