import { Controller, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from 'src/interface/service/auth.service';
import { UserEntity } from 'src/domain/entities/userTeam/userTeam.user.entity';
import { formatResponse } from 'src/utils/formatResponse/formatRespons';
import { Role } from 'src/utils/constance/constance.role';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body() user: { name: string, email: string, password: string },
        @Res() res: Response
    ) {
        try {
            console.log('Registering user:', user.email);
            const newUser = await this.authService.register(UserEntity.create({
                id: '',
                name: user.name,
                email: user.email,
                role: Role.OWNER,
                teamId: '',
                createdBy: '',
                otp: '',
                otpExpiresAt: new Date(),
                otpVerified: false,
                password: user.password,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            console.log('User created successfully:', newUser.user.id);
            return formatResponse(res, 200, 'success', 'User created successfully', newUser);
        } catch (error) {
            console.error('Registration error:', error);
            
            // Si l'erreur est liée à l'envoi d'email, on peut quand même considérer l'inscription comme réussie
            if (error.message && (error.message.includes('email') || error.message.includes('OTP'))) {
                return formatResponse(res, 200, 'success', 'User created successfully, but OTP email failed to send. Please try resending OTP.', {
                    user: null,
                    access_token: null,
                    emailSent: false
                });
            }
            
            return formatResponse(res, 400, 'failed', 'User creation failed', error);
        }
    }

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

    @Post('login')
    async login(
        @Body() user: { email: string, password: string },
        @Res() res: Response
    ) {
        try {
            const token = await this.authService.login(user.email, user.password);
            return formatResponse(res, 200, 'success', 'User logged in successfully', token);
        } catch (error) {
            return formatResponse(res, 400, 'failed', 'User login failed', error);
        }
    }

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