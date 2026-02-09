import { IsEmail, IsString, Min } from 'class-validator';

export class LoginDTO {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
