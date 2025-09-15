import type { Response } from "express";
import { UserService } from "../../interface/service/user.service";
import { JwtService } from "@nestjs/jwt";
export declare class UserController {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    createUser(body: {
        name: string;
        email: string;
        password: string;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findAllUsers(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findOneUser(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(id: string, updateUserDto: {
        name?: string;
        email?: string;
        password?: string;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    removeUser(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    inviteUser(inviteData: {
        email: string;
        teamId: string;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyInvite(token: string, userData: {
        name: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}
