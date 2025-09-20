import { Role } from "../../../utils/constance/constance.role";

export class TeamMemberEntity {
    id: string;
    teamId: string;
    creator: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;

    private constructor(props: {
        id: string;
        teamId: string;
        creator: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = props.id;
        this.teamId = props.teamId;
        this.creator = props.creator;
        this.role = props.role;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    
    static create(props: {
        id: string;
        teamId: string;
        creator: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }): TeamMemberEntity {
        return new TeamMemberEntity({ ...props });
    }
}