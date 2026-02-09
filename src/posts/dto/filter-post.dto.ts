import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class FilterPostDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  userId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  published?: boolean;
}
