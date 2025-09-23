import { Role } from "../../../utils/constance/constance.role";
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    role: Role;
    password: string;
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
        createdBy?: string;
        createdAt?: Date;
        updatedAt?: Date;
        fcmToken?: string;
    }): UserEntity;
}
