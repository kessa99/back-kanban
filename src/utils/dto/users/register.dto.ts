import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../../constance/constance.role';

export class RegisterUserDto {
  @ApiProperty({ description: "The user's first name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "The user's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The user's password" })
  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @ApiProperty({ description: "The user's role", required: false })
  @IsOptional()
  role?: Role | string;

  @ApiProperty({ description: "Is the email verified", required: false })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiProperty({ description: "OTP code", required: false })
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiProperty({ description: "Created by user id", required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ description: "Created timestamp", required: false })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({ description: "Updated timestamp", required: false })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
