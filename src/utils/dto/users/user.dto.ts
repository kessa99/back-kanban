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
  @IsOptional()
  createdBy?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}