import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDate, IsBoolean } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role?: string;

  @IsString()
  @IsNotEmpty()
  otp?: string;

  @IsDate()
  @IsNotEmpty()
  otpExpiresAt?: Date;

  @IsBoolean()
  @IsNotEmpty()
  otpVerified?: boolean;
}