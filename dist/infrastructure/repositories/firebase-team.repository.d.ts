import { TeamEntity } from '../../domain/entities/userTeam/userTeam.team.entity';
import { ITeamRepository } from '../../domain/repositories/teamrepository';
import { firestore } from 'firebase-admin';
export declare class FirebaseTeamRepository implements ITeamRepository {
    private readonly firestore;
    private readonly teamCollection;
    constructor(firestore: firestore.Firestore);
    create(team: TeamEntity): Promise<TeamEntity>;
    getTeamMembers(id: string): Promise<string[]>;
    findById(id: string): Promise<TeamEntity | null>;
    findAll(): Promise<TeamEntity[]>;
    findByOwnerId(ownerId: string): Promise<TeamEntity[]>;
    update(team: TeamEntity): Promise<TeamEntity>;
    delete(id: string): Promise<void>;
}
