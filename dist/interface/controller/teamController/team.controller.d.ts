import type { Response } from 'express';
import { TeamService } from '../../../interface/service/team.service';
import { CreateTeamDto } from '../../../utils/dto/team/create-team.dto';
import { UpdateTeamDto } from '../../../utils/dto/team/update-team.dto';
import { JwtService } from '@nestjs/jwt';
export declare class TeamController {
    private readonly teamService;
    private readonly jwtService;
    constructor(teamService: TeamService, jwtService: JwtService);
    createTeam(createTeamDto: CreateTeamDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getTeams(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getTeamDetails(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTeam(id: string, updateTeamDto: UpdateTeamDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteTeam(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    addMember(id: string, body: {
        memberId: string;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    removeMember(id: string, memberId: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getMembers(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    changeMemberRole(id: string, memberId: string, body: {
        role: 'admin' | 'member' | 'viewer';
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
