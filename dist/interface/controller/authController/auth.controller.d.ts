import type { Response } from 'express';
import { AuthService } from '../../../interface/service/auth.service';
import { RegisterUserDto } from '../../../utils/dto/users/register.dto';
import { UserService } from '../../service/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    register(userDto: RegisterUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
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
