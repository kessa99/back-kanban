/*
    UserController is a controller that handles the user data.
    It is used to create, find, update and delete users.
    It is used to handle the user data.
    It is used to handle the user data.
*/

import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, HttpException, HttpStatus, UseGuards, Request } from "@nestjs/common";
import type { Response } from "express";
import { UserService } from "src/interface/service/user.service";
import { UserEntity } from "src/domain/entities/userTeam/userTeam.user.entity";
import { formatResponse } from "src/utils/formatResponse/formatRespons";
import { JwtService } from "@nestjs/jwt";
import { Role } from "src/utils/constance/constance.role";
import { AuthGuard } from '@nestjs/passport';

@Controller("users")
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  async createUser(
    @Body() body: { name: string, email: string, password: string },
    @Request() req: any,
    @Res() res: Response
  ) {
    try {
      // Debug: Vérifier le contenu du token
      console.log('Request user:', req.user);
      console.log('User ID from token:', req.user?.id);
      
      // Récupérer l'ID de l'utilisateur authentifié depuis le token
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      const user = await this.userService.createUser(body.name, body.email, body.password, createdBy);
      return formatResponse(res, 200, "success", "User created successfully", user);
    } catch (error) {
      console.error('Create user error:', error);
      return formatResponse(res, 400, "failed", "User creation failed", error);
    }
  }

  @Get(":id")
  async getUserById(
    @Param("id") id: string,
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.findUserById(id);
      return formatResponse(res, 200, "success", "User found successfully", user);
    } catch (error) {
      return formatResponse(res, 400, "failed", "User not found", error);
    }
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() body: { name: string, email: string, password: string },
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.updateUser(id, body.name, body.email, body.password);
      return formatResponse(res, 200, "success", "User updated successfully", user);
    } catch (error) {
      return formatResponse(res, 400, "failed", "User update failed", error);
    }
  }

  @Get()
  async getUsers(
    @Request() req: any,
    @Res() res: Response
  ) {
    try {
      // Debug: Vérifier le contenu du token
      console.log('Request user for getUsers:', req.user);
      console.log('User ID from token:', req.user?.id);
      
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      const users = await this.userService.findUsersByCreatedBy(createdBy);
      console.log('Found users:', users.length);
      return formatResponse(res, 200, "success", "Users found successfully", users);
    } catch (error) {
      console.error('Get users error:', error);
      return formatResponse(res, 400, "failed", "Users not found", error);
    }
  }

  @Delete(":id")
  async deleteUser(
    @Param("id") id: string,
    @Res() res: Response
  ) {
    try {
      await this.userService.deleteUser(id);
      return formatResponse(res, 200, "success", "User deleted successfully", null);
    } catch (error) {
      return formatResponse(res, 400, "failed", "User deletion failed", error);
    }
  }

  @Post("invite")
  async inviteUser(
    @Body() body: { teamId: string, inviteData: { email: string }, ownerId: string, role: string },
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.inviteUser(body.teamId, body.inviteData, body.ownerId, body.role);
      return formatResponse(res, 200, "success", "User invited successfully", user);
    } catch (error) {
      return formatResponse(res, 400, "failed", "User invitation failed", error);
    }
  }

  @Post('verify-invite')
  async verifyInvite(@Body('token') token: string, @Body() userData: { name: string; password: string }, @Res() res: Response) {
    try {
      const user = await this.userService.verifyInvite(token, userData);
      return formatResponse(res, 200, "success", "Invitation approved", user);
    } catch (error) {
      return formatResponse(res, 400, "failed", "Invalid token or expired", {});
    }
  }
}