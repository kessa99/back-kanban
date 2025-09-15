import { Role } from "../../../utils/constance/constance.role";
export declare class TeamMemberEntity {
    id: string;
    teamId: string;
    userId: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
