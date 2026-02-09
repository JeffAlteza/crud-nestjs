import { IsBoolean, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsNumber()
  userId: number;
}
