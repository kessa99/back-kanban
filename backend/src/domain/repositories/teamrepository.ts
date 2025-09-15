import { TeamEntity } from '../entities/userTeam/userTeam.team.entity';

export interface ITeamRepository {
    create(team: TeamEntity): Promise<TeamEntity>;
    findById(id: string): Promise<TeamEntity | null>;
    findAll(): Promise<TeamEntity[]>;
    findByOwnerId(ownerId: string): Promise<TeamEntity[]>;
    update(team: TeamEntity): Promise<TeamEntity>;
    delete(id: string): Promise<void>;
}