import { IsEmail, IsNotEmpty } from "class-validator";

export class InvitationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

}