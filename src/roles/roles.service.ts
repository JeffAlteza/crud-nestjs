import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.rolesRepository.findOneBy({ name: createRoleDto.name });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    return this.rolesRepository.save(createRoleDto);
  }

  findAll(query: PaginateQuery, include?: string[]): Promise<Paginated<Role>> {
    const allowedRelations = ['users'];
    const relations = include
      ? include.filter((rel) => allowedRelations.includes(rel))
      : [];

    return paginate(query, this.rolesRepository, {
      sortableColumns: ['id', 'name'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['name', 'description'],
      relations: relations,
    });
  }

  findOne(id: number) {
    return this.findRoleById(id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findRoleById(id);

    return this.rolesRepository.save({ ...role, ...updateRoleDto });
  }

  async remove(id: number) {
    const role = await this.findRoleById(id);

    return this.rolesRepository.delete(role.id);
  }

  async assignRolesToUser(assignRoleDto: AssignRoleDto) {
    const user = await this.usersRepository.findOne({
      where: { id: assignRoleDto.userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.rolesRepository.findBy({
      id: In(assignRoleDto.roleIds),
    });

    if (roles.length !== assignRoleDto.roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    user.roles = roles;
    return this.usersRepository.save(user);
  }

  async removeRolesFromUser(userId: number, roleIds: number[]) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = user.roles.filter((role) => !roleIds.includes(role.id));
    return this.usersRepository.save(user);
  }

  async getUserRoles(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.roles;
  }

  private async findRoleById(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (role) {
      return role;
    }

    throw new NotFoundException('Role not found');
  }
}
