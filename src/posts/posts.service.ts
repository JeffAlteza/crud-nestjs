import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery, FilterOperator } from 'nestjs-paginate';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return this.postsRepository.save(createPostDto);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Post>> {
    return paginate(query, this.postsRepository, {
      sortableColumns: ['id', 'title', 'published', 'createdAt'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['title', 'content'],
      filterableColumns: {
        userId: [FilterOperator.EQ],
        published: [FilterOperator.EQ],
      },
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
