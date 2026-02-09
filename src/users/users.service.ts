import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find({ relations: ['profile'] });
  }

  findOne(id: number) {
    return this.findUserIndexById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserIndexById(id);
    
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async remove(id: number) {
    const user = await this.findUserIndexById(id);

    return this.usersRepository.delete(user.id);
  }

  private async findUserIndexById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (user) {
      return user;
    }

    throw new NotFoundException(`User not found`);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      return user;
    }

    throw new NotFoundException(`Email not found`);
  }
}
