import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  // Assign roles to user (replaces all roles)
  @Post('assign')
  assignRoles(@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignRolesToUser(assignRoleDto);
  }

  // Remove specific roles from user
  @Delete('user/:userId')
  removeRolesFromUser(
    @Param('userId') userId: string,
    @Body('roleIds') roleIds: number[],
  ) {
    return this.rolesService.removeRolesFromUser(+userId, roleIds);
  }

  // Get user's roles
  @Get('user/:userId')
  getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(+userId);
  }
}
