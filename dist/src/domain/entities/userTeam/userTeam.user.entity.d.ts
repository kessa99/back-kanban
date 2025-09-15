import { Role } from "src/utils/constance/constance.role";
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    teamId?: string;
    createdBy?: string;
    otp: string;
    otpExpiresAt: Date;
    otpVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    private constructor();
    static create(props: {
        id: string;
        name: string;
        email: string;
        password: string;
        role: Role;
        teamId?: string;
        createdBy?: string;
        otp: string;
        otpExpiresAt: Date;
        otpVerified?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): UserEntity;
}
