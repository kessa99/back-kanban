import { Role } from "src/utils/constance/constance.role";

export class TeamMemberEntity {
    id: string;
    teamId: string;
    userId: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}