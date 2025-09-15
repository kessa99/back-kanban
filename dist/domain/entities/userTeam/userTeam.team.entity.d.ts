export interface TeamMember {
    userId: string;
    role: 'admin' | 'member' | 'viewer';
    joinedAt: Date;
}
export declare class TeamEntity {
    id: string;
    name: string;
    ownerId: string;
    members: string[];
    createdAt: Date;
    updatedAt: Date;
    private constructor();
    static create(props: {
        id: string;
        name: string;
        ownerId: string;
        members?: string[];
        createdAt?: Date;
        updatedAt?: Date;
    }): TeamEntity;
}
