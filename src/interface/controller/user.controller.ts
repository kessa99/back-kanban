/*
    UserController is a controller that handles the user data.
    It is used to create, find, update and delete users.
    It is used to handle the user data.
    It is used to handle the user data.
*/

import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, HttpException, HttpStatus, UseGuards, Request, ValidationPipe, UsePipes } from "@nestjs/common";
import type { Response } from "express";
import { UserService } from "../../interface/service/user.service";
// import { UserEntity } from "../../domain/entities/userTeam/userTeam.user.entity";
import { formatResponse } from "../../utils/formatResponse/formatRespons";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../../utils/constance/constance.role";
// import { AuthGuard } from '@nestjs/passport';
// import { RegisterUserDto } from "../../utils/dto/users/register.dto";
import { FirebaseAuthGuard } from "../../config/jwt/firebase-auth.guard";
import { RegisterUserDto } from "../../utils/dto/users/register.dto";
import * as firebaseAdmin from 'firebase-admin';
import { firestore } from "../../config/firebase/firebase.config";



@Controller("users")
// @UseGuards(AuthGuard('jwt'))
@UseGuards(FirebaseAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}


  @Post()
  async createUser(
    @Body() registerUserDto: RegisterUserDto,
    @Request() req: any,
    @Res() res: Response
  ) {
    try {
      const createdBy = req.user?.id;
      
      console.log('-------------------------------------------------------------------');
      console.log('User ID from token:', req.user?.id);
      console.log('-------------------------------------------------------------------');
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }

      const user = await this.userService.createUser(registerUserDto, createdBy);
      console.log('-------------------------------------------------------------------');
      console.log('User created with succès dans le controller');
      console.log('-------------------------------------------------------------------');
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
      console.log('-------------------------------------------------------------------');
      console.log('Users retrieved with succès dans le controller');
      console.log('-------------------------------------------------------------------');
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
      console.log('-------------------------------------------------------------------');
      console.log('User retrieved with succès dans le controller');
      console.log('-------------------------------------------------------------------');
      return formatResponse(res, 200, "success", "User retrieved successfully", user);
    } catch (error) {
      console.error('Find one user error:', error);
      return formatResponse(res, 400, "failed", "Failed to retrieve user", error);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: { name?: string, email?: string, password?: string }, @Request() req: any, @Res() res: Response) {
    try {
      const createdBy = req.user?.id;
      
      if (!createdBy) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      const user = await this.userService.updateUser(id, updateUserDto);
      console.log('-------------------------------------------------------------------');
      console.log('==> User updated with succès dans le controller');
      console.log('-------------------------------------------------------------------');
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
      console.log('-------------------------------------------------------------------');
      console.log('User deleted with succès dans le controller');
      console.log('-------------------------------------------------------------------');
      return formatResponse(res, 200, "success", "User deleted successfully", null);
    } catch (error) {
      console.error('Remove user error:', error);
      return formatResponse(res, 400, "failed", "Failed to delete user", error);
    }
  }

  // pour voir la liste des task d'un user
  @Get('tasks')
  async getTasks(@Request() req: any, @Res() res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return formatResponse(res, 401, "failed", "User not authenticated", null);
      }
      
      // const tasks = await this.userService.getTasks(userId);
      console.log('-------------------------------------------------------------------');
      console.log('Tasks retrieved with succès dans le controller');
      console.log('-------------------------------------------------------------------');
      return formatResponse(res, 200, "success", "Tasks retrieved successfully", null);
    } catch (error) {
      console.error('Get tasks error:', error);
      return formatResponse(res, 400, "failed", "Failed to retrieve tasks", error);
    }
  }


  // @Post('invite')
  // async inviteUser(@Body() inviteData: { email: string, teamId: string }, @Request() req: any, @Res() res: Response) {
  //   try {
  //     const createdBy = req.user?.id;
      
  //     if (!createdBy) {
  //       return formatResponse(res, 401, "failed", "User not authenticated", null);
  //     }
      
  //     const result = await this.userService.inviteUser(inviteData.teamId, { email: inviteData.email }, createdBy, Role.MEMBER);
  //     return formatResponse(res, 200, "success", "Invitation sent successfully", result);
  //   } catch (error) {
  //     console.error('Invite user error:', error);
  //     return formatResponse(res, 400, "failed", "Failed to send invitation", error);
  //   }
  // }

  // @Post('verify-invite')
  // async verifyInvite(@Body('token') token: string, @Body() userData: { name: string; password: string }, @Res() res: Response) {
  //   try {
  //     const user = await this.userService.verifyInvite(token, userData);
  //     return formatResponse(res, 200, "success", "Invitation approved", user);
  //   } catch (error) {
  //     return formatResponse(res, 400, "failed", "Invalid token or expired", {});
  //   }
  // }
}
