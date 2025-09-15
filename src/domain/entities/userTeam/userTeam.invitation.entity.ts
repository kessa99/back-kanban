import { Status } from "../../../utils/constance/constance.status";

export class InvitationEntity {
    id: string;
    teamId: string;
    email: string;
    invitedBy: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}