import { Role } from "../../../utils/constance/constance.role";
import { Status } from "../../../utils/constance/constance.status";
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    role: Role;
    password: string;
    statusInvite?: Status;
    emailVerified: boolean;
    otp: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    fcmToken?: string;
    private constructor();
    static create(props: {
        id: string;
        name: string;
        email: string;
        password: string;
        role: Role;
        statusInvite?: Status;
        emailVerified: boolean;
        otp: string;
        createdBy?: string;
        createdAt?: Date;
        updatedAt?: Date;
        fcmToken?: string;
    }): UserEntity;
}
