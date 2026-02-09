import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  userId: number;
}
