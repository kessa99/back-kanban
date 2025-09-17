import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TeamService } from '../../../interface/service/team.service';
import { CreateTeamDto } from '../../../utils/dto/team/create-team.dto';
import { UpdateTeamDto } from '../../../utils/dto/team/update-team.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../../../domain/entities/userTeam/userTeam.user.entity';
import { formatResponse } from '../../../utils/formatResponse/formatRespons';
import { JwtService } from '@nestjs/jwt';

@Controller('teams')
@UseGuards(AuthGuard('jwt'))
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
        private readonly jwtService: JwtService
    ) {}

    @Post('create')
    async createTeam(@Body() createTeamDto: CreateTeamDto, @Request() req: any, @Res() res: Response) {
        try {
            const user = req.user as UserEntity;
                // if (!user.otpVerified) {
                //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
                // }
            const team = await this.teamService.createTeam(createTeamDto, user.id);
            return formatResponse(res, 201, "success", "Team created successfully", team);
        } catch (error) {
            return formatResponse(res, 400, "failed", "Error creating team", error.message);
        }
    }

    @Get()
    async getTeams(@Request() req: any, @Res() res: Response) {
        try {
            const user = req.user as UserEntity;
            console.log('User:', user);
            
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            
            // Rechercher toutes les équipes où l'utilisateur est le propriétaire
            const teams = await this.teamService.findAll(user.id);
            return formatResponse(res, 200, "success", "Teams fetched successfully", teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
            return formatResponse(res, 400, "failed", "Error fetching teams", error.message);
        }
    }

    @Get(':id')
    async getTeamDetails(@Param('id') id: string, @Request() req: any, @Res() res: Response) {
        try {
            const user = req.user as UserEntity;
            
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            
            const team = await this.teamService.getTeamWithMembers(id, user.id);
            return formatResponse(res, 200, "success", "Team details fetched successfully", team);
        } catch (error) {
            console.error('Error fetching team details:', error);
            return formatResponse(res, 400, "failed", "Error fetching team details", error.message);
        }
    }

    @Put(':id')
    async updateTeam(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @Request() req: any, @Res() res: Response) {
        try {
            const user = req.user as UserEntity;
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            const team = await this.teamService.update(id, updateTeamDto, user.id);
            return formatResponse(res, 200, "success", "Team updated successfully", team);
        } catch (error) {
            return formatResponse(res, 400, "failed", "Team update failed", error);
        }
    }

    @Delete(':id')
    async deleteTeam(@Param('id') id: string, @Request() req: any, @Res() res: Response) {
        try {
            const user = req.user as UserEntity;
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            const team = await this.teamService.delete(id, user.id);
            return formatResponse(res, 200, "success", "Team deleted successfully", team);
        } catch (error) {
            return formatResponse(res, 400, "failed", "Team deletion failed", error);
        }
    }

    @Post(':id/members')
    async addMember(
        @Param('id') id: string, 
        @Body() body: { memberId: string }, 
        @Request() req: any, 
        @Res() res: Response
    ) {
        try {
            const user = req.user as UserEntity;
            console.log('Adding member to team:', id, 'Member ID:', body.memberId);
            
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            
            await this.teamService.addMember(id, body.memberId, user.id);
            
            // Récupérer l'équipe mise à jour pour la retourner
            const updatedTeam = await this.teamService.findById(id, user.id);
            
            return formatResponse(res, 200, "success", "Member added successfully", updatedTeam);
        } catch (error) {
            console.error('Error adding member:', error);
            return formatResponse(res, 400, "failed", "Member addition failed", error.message);
        }
    }

    @Delete(':id/members/:memberId')
    async removeMember(
        @Param('id') id: string, 
        @Param('memberId') memberId: string, 
        @Request() req: any, 
        @Res() res: Response
    ) {
        try {
            const user = req.user as UserEntity;
            console.log('Removing member from team:', id, 'Member ID:', memberId);
            
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            
            await this.teamService.removeMember(id, memberId, user.id);
            
            // Récupérer l'équipe mise à jour pour la retourner
            const updatedTeam = await this.teamService.findById(id, user.id);
            
            return formatResponse(res, 200, "success", "Member removed successfully", updatedTeam);
        } catch (error) {
            console.error('Error removing member:', error);
            return formatResponse(res, 400, "failed", "Member removal failed", error.message);
        }
    }

    @Get(':id/members')
    async getMembers(@Param('id') id: string, @Request() req: any, @Res() res: Response) {
        try {
            const user = req.user as UserEntity;
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            const members = await this.teamService.getMembers(id);
            return formatResponse(res, 200, "success", "Members fetched successfully", members);
        } catch (error) {
            return formatResponse(res, 400, "failed", "Members not found", error);
        }
    }

    @Put(':id/members/:memberId/role')
    async changeMemberRole(
        @Param('id') id: string,
        @Param('memberId') memberId: string,
        @Body() body: { role: 'admin' | 'member' | 'viewer' },
        @Request() req: any,
        @Res() res: Response
    ) {
        try {
            const user = req.user as UserEntity;
            console.log('=== CHANGE MEMBER ROLE CONTROLLER ===');
            console.log('Team ID:', id);
            console.log('Member ID:', memberId);
            console.log('New Role:', body.role);
            console.log('User ID:', user.id);
            
            // if (!user.otpVerified) {
            //     return formatResponse(res, 400, "failed", "You can access this feature after verifying your email", null);
            // }
            
            await this.teamService.changeMemberRole(id, memberId, body.role, user.id);
            
            // Récupérer l'équipe mise à jour
            const updatedTeam = await this.teamService.getTeamWithMembers(id, user.id);
            
            return formatResponse(res, 200, "success", "Member role updated successfully", updatedTeam);
        } catch (error) {
            console.error('Error changing member role:', error);
            return formatResponse(res, 400, "failed", "Role change failed", error.message);
        }
    }
}