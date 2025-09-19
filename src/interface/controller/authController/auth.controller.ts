import { Controller, Post, Body, UseGuards, Request, Res, Get, ValidationPipe, UsePipes, Patch, Param } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../../../interface/service/auth.service';
import { UserEntity } from '../../../domain/entities/userTeam/userTeam.user.entity';
import { formatResponse } from '../../../utils/formatResponse/formatRespons';
import { Role } from '../../../utils/constance/constance.role';
import { RegisterUserDto } from '../../../utils/dto/users/register.dto';
import { UserService } from '../../service/user.service';
import { LoginDto } from '../../../utils/dto/users/login.dta';
import { UpdateFcmDto } from '../../../utils/dto/users/UpdateFcmDto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('register-test')
    @UsePipes(new ValidationPipe({ transform: true }))
    async registerUser(@Body() registerUserDTo: RegisterUserDto, @Res() res: Response) {
      const newUser = await this.userService.registerUser(registerUserDTo);
      return formatResponse(res, 200, 'success', 'User registered successfully', newUser);
    }
    
    @Post('login')
    @UsePipes(new ValidationPipe({ transform: true }))
    async loginFirebase(@Body() loginDto: LoginDto, @Res() res: Response) {
      const token = await this.authService.loginUser(loginDto);
      console.log('-------------------------------------------------------------------');
      console.log('User logged in successfully');
      return formatResponse(res, 200, 'success', 'User logged in successfully', token);
    }
    
    // @Post('register')
    // async register(
    //     @Body() user: { name: string, email: string, password: string },
    //     @Res() res: Response
    // ) {
    //     try {
    //         console.log('Registering user:', user.email);
    //         const newUser = await this.authService.register(UserEntity.create({
    //             id: '',
    //             name: user.name,
    //             email: user.email,
    //             createdBy: '',
    //             password: user.password,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         }));
    //         console.log('User created successfully:', newUser.user.id);
    //         return formatResponse(res, 200, 'success', 'User created successfully', newUser);
    //     } catch (error) {
    //         console.error('Registration error:', error);
            
    //         // Si l'erreur est liée à l'envoi d'email, on peut quand même considérer l'inscription comme réussie
    //         if (error.message && (error.message.includes('email') || error.message.includes('OTP'))) {
    //             return formatResponse(res, 200, 'success', 'User created successfully, but OTP email failed to send. Please try resending OTP.', {
    //                 user: null,
    //                 access_token: null,
    //                 emailSent: false
    //             });
    //         }
            
    //         return formatResponse(res, 400, 'failed', 'User creation failed', error);
    //     }
    // }

    @Post('verify-otp')
    async verifyOtp(
        @Body() user: { email: string, otp: string },
        @Res() res: Response
    ) {
        try {
            const isVerified = await this.authService.verifyOTP(user.email, user.otp);
            console.log('OTP verification result:', isVerified);
            return formatResponse(res, 200, 'success', 'OTP verified successfully', isVerified);
        } catch (error) {
            return formatResponse(res, 400, 'failed', 'OTP verification failed', error);
        }
    }

    @Post('resend-otp')
    async resendOtp(
        @Body() user: { email: string },
        @Res() res: Response
    ) {
        try {
            const otp = await this.authService.resendOtp(user.email);
            return formatResponse(res, 200, 'success', 'OTP resent successfully', otp);
        } catch (error) {
            return formatResponse(res, 400, 'failed', 'OTP resend failed', error);
        }
    }

    // @Post('login')
    // async login(
    //     @Body() user: { email: string, password: string },
    //     @Res() res: Response
    // ) {
    //     try {
    //         const token = await this.authService.login(user.email, user.password);
    //         return formatResponse(res, 200, 'success', 'User logged in successfully', token);
    //     } catch (error) {
    //         return formatResponse(res, 400, 'failed', 'User login failed', error);
    //     }
    // }

    @Post('logout')
    async logout(
        @Res() res: Response
    ) {
        try {
            return formatResponse(res, 200, 'success', 'User logged out successfully', null);
        } catch (error) {
            return formatResponse(res, 400, 'failed', 'User logout failed', error);
        }
    }
}