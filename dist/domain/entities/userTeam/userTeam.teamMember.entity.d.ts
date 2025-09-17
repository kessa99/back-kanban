import { Role } from "../../../utils/constance/constance.role";
export declare class TeamMemberEntity {
    id: string;
    teamId: string;
    creator: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    private constructor();
    static create(props: {
        id: string;
        teamId: string;
        creator: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }): TeamMemberEntity;
}
