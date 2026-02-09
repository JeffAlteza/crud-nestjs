import { DataSource } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';

export async function seedPosts(dataSource: DataSource, users: User[]): Promise<void> {
  const postRepository = dataSource.getRepository(Post);

  // Check if posts already exist
  const existingCount = await postRepository.count();
  if (existingCount > 0) {
    console.log(`Posts already exist (${existingCount} found). Skipping...`);
    return;
  }

  const postsPerUser = 5;
  const totalPosts = users.length * postsPerUser;
  console.log(`Generating ${totalPosts} posts (${postsPerUser} per user) with faker...`);

  const posts: Partial<Post>[] = [];
  const batchSize = 500;

  for (const user of users) {
    for (let i = 0; i < postsPerUser; i++) {
      posts.push({
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        content: faker.lorem.paragraphs({ min: 2, max: 5 }),
        published: faker.datatype.boolean({ probability: 0.7 }), // 70% published
        userId: user.id,
      });
    }
  }

  // Insert in batches for better performance
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);

    await postRepository
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values(batch)
      .execute();

    console.log(`Inserted posts ${i + 1} to ${Math.min(i + batchSize, posts.length)}`);
  }

  console.log(`Created ${posts.length} posts`);
}
