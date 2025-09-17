import type { Response } from "express";
import { UserService } from "../../interface/service/user.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto } from "../../utils/dto/users/register.dto";
export declare class UserController {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    createUser(registerUserDto: RegisterUserDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findAllUsers(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findOneUser(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(id: string, updateUserDto: {
        name?: string;
        email?: string;
        password?: string;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    removeUser(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getTasks(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
