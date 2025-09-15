import type { Response } from 'express';
import { AuthService } from '../../../interface/service/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(user: {
        name: string;
        email: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyOtp(user: {
        email: string;
        otp: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    resendOtp(user: {
        email: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    login(user: {
        email: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
}
