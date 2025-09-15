export declare class UserDto {
    name: string;
    email: string;
    password: string;
    role?: string;
    otp?: string;
    otpExpiresAt?: Date;
    otpVerified?: boolean;
}
