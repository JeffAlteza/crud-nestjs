import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return this.postsRepository.save(createPostDto);
  }

  findAll(filterDto?: FilterPostDto) {
    const where: FindOptionsWhere<Post> = {};

    if (filterDto?.userId) {
      where.userId = filterDto.userId;
    }

    if (filterDto?.published !== undefined) {
      where.published = filterDto.published;
    }

    return this.postsRepository.find({
      where,
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.findPostById(id);
  }

  async findByUserId(userId: number) {
    return this.postsRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findPostById(id);

    return this.postsRepository.save({ ...post, ...updatePostDto });
  }

  async remove(id: number) {
    const post = await this.findPostById(id);

    return this.postsRepository.delete(post.id);
  }

  private async findPostById(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (post) {
      return post;
    }

    throw new NotFoundException('Post not found');
  }
}
