import { TeamEntity } from 'src/domain/entities/userTeam/userTeam.team.entity';
import { FirebaseTeamRepository } from 'src/infrastructure/repositories/firebase-team.repository';
import { CreateTeamDto } from 'src/utils/dto/team/create-team.dto';
import { UserService } from './user.service';
export declare class TeamService {
    private readonly teamRepository;
    private readonly userService;
    constructor(teamRepository: FirebaseTeamRepository, userService: UserService);
    createTeam(createTeamDto: CreateTeamDto, ownerId: string): Promise<TeamEntity>;
    findById(id: string, userId: string): Promise<any>;
    findAll(userId: string): Promise<any[]>;
    getTeamMembers(id: string, ownerId: string): Promise<string[]>;
    update(id: string, updates: Partial<TeamEntity>, ownerId: string): Promise<TeamEntity>;
    delete(id: string, ownerId: string): Promise<void>;
    addMember(id: string, memberId: string, ownerId: string): Promise<void>;
    removeMember(id: string, memberId: string, ownerId: string): Promise<void>;
    getMembers(id: string): Promise<string[]>;
    changeMemberRole(id: string, memberId: string, newRole: 'admin' | 'member' | 'viewer', ownerId: string): Promise<void>;
    getTeamWithMembers(id: string, userId: string): Promise<any>;
}
