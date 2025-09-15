/*
    UserController is a controller that handles the user data.
    It is used to create, find, update and delete users.
    It is used to handle the user data.
    It is used to handle the user data.
*/

import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, HttpException, HttpStatus, UseGuards, Request, ValidationPipe, UsePipes } from "@nestjs/common";
import type { Response } from "express";
import { UserService } from "../../interface/service/user.service";
import { UserEntity } from "../../domain/entities/userTeam/userTeam.user.entity";
import { formatResponse } from "../../utils/formatResponse/formatRespons";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../../utils/constance/constance.role";
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from "../../utils/dto/users/register.dto";

@Controller("users")
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  // @Post('register')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // registerUser(@Body() registerUserDTo: RegisterUserDto) {
  //   return this.userService.registerUser(registerUserDTo);
  // }

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

  @Get()
  async findAllUsers(@Request() req: any, @Res() res: Response) {
    try {
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      const users = await this.userService.findUsersByCreatedBy(createdBy);
      return formatResponse(res, 200, "success", "Users retrieved successfully", users);
    } catch (error) {
      console.error('Find all users error:', error);
      return formatResponse(res, 400, "failed", "Failed to retrieve users", error);
    }
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string, @Request() req: any, @Res() res: Response) {
    try {
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      const user = await this.userService.findById(id);
      return formatResponse(res, 200, "success", "User retrieved successfully", user);
    } catch (error) {
      console.error('Find one user error:', error);
      return formatResponse(res, 400, "failed", "Failed to retrieve user", error);
    }
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: { name?: string, email?: string, password?: string }, @Request() req: any, @Res() res: Response) {
    try {
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      const user = await this.userService.updateUser(id, updateUserDto.name || '', updateUserDto.email || '', updateUserDto.password || '');
      return formatResponse(res, 200, "success", "User updated successfully", user);
    } catch (error) {
      console.error('Update user error:', error);
      return formatResponse(res, 400, "failed", "Failed to update user", error);
    }
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string, @Request() req: any, @Res() res: Response) {
    try {
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      await this.userService.deleteUser(id);
      return formatResponse(res, 200, "success", "User deleted successfully", null);
    } catch (error) {
      console.error('Remove user error:', error);
      return formatResponse(res, 400, "failed", "Failed to delete user", error);
    }
  }

  @Post('invite')
  async inviteUser(@Body() inviteData: { email: string, teamId: string }, @Request() req: any, @Res() res: Response) {
    try {
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      const result = await this.userService.inviteUser(inviteData.teamId, { email: inviteData.email }, createdBy, Role.MEMBER);
      return formatResponse(res, 200, "success", "Invitation sent successfully", result);
    } catch (error) {
      console.error('Invite user error:', error);
      return formatResponse(res, 400, "failed", "Failed to send invitation", error);
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
