import type { Response } from "express";
import { UserService } from "src/interface/service/user.service";
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
    getUserById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(id: string, body: {
        name: string;
        email: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    getUsers(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    inviteUser(body: {
        teamId: string;
        inviteData: {
            email: string;
        };
        ownerId: string;
        role: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyInvite(token: string, userData: {
        name: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}
