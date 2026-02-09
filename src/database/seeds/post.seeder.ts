import { DataSource } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

export async function seedPosts(dataSource: DataSource, users: User[]): Promise<void> {
  const postRepository = dataSource.getRepository(Post);

  const postsData = [
    {
      title: 'Getting Started with NestJS',
      content: 'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. In this post, we will explore the basics of NestJS and how to get started.',
      published: true,
    },
    {
      title: 'Understanding TypeORM Relationships',
      content: 'TypeORM makes it easy to work with databases in TypeScript. This post covers the different types of relationships: One-to-One, One-to-Many, and Many-to-Many.',
      published: true,
    },
    {
      title: 'JWT Authentication in NestJS',
      content: 'Security is important for any application. Learn how to implement JWT-based authentication in your NestJS application with guards and decorators.',
      published: true,
    },
    {
      title: 'Draft: Advanced NestJS Patterns',
      content: 'This is a draft post about advanced patterns in NestJS including interceptors, pipes, and custom decorators. Coming soon!',
      published: false,
    },
    {
      title: 'Building REST APIs with NestJS',
      content: 'REST APIs are the backbone of modern web applications. This guide shows you how to build robust REST APIs using NestJS with proper validation and error handling.',
      published: true,
    },
  ];

  let postIndex = 0;
  for (const user of users) {
    // Give each user 1-2 posts
    const numPosts = user.id === 1 ? 2 : user.id === 2 ? 2 : 1;

    for (let i = 0; i < numPosts && postIndex < postsData.length; i++) {
      const postData = postsData[postIndex];

      const existingPost = await postRepository.findOneBy({
        title: postData.title,
        userId: user.id,
      });

      if (!existingPost) {
        const post = postRepository.create({
          ...postData,
          userId: user.id,
        });
        await postRepository.save(post);
        console.log(`Created post: "${postData.title}" for user: ${user.email}`);
      } else {
        console.log(`Post already exists: "${postData.title}"`);
      }

      postIndex++;
    }
  }
}
