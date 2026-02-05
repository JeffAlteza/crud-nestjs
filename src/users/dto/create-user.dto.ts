import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    age?: number;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
