import { IsArray, IsNumber } from 'class-validator';

export class AssignRoleDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
