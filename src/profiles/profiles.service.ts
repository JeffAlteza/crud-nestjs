import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const existingProfile = await this.profilesRepository.findOneBy({ userId: createProfileDto.userId });

    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }

    return this.profilesRepository.save(createProfileDto);
  }

  findAll() {
    return this.profilesRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.findProfileById(id);
  }

  async findByUserId(userId: number) {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }

    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findProfileById(id);

    return this.profilesRepository.save({ ...profile, ...updateProfileDto });
  }

  async remove(id: number) {
    const profile = await this.findProfileById(id);

    return this.profilesRepository.delete(profile.id);
  }

  private async findProfileById(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (profile) {
      return profile;
    }

    throw new NotFoundException('Profile not found');
  }
}
