import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);

  // Check if users already exist
  const existingCount = await userRepository.count();
  if (existingCount > 0) {
    console.log(`Users already exist (${existingCount} found). Fetching existing users...`);
    return await userRepository.find();
  }

  console.log('Generating 1000 users with faker...');

  // Pre-hash a common password for performance (all users will have 'password123')
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users: Partial<User>[] = [];
  const batchSize = 100;

  // Add fixed admin user for login testing
  users.push({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    age: 30,
  });

  // Generate 999 more users with faker (total 1000)
  for (let i = 0; i < 999; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      age: faker.number.int({ min: 18, max: 65 }),
    });
  }

  // Insert in batches for better performance
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    // Use query builder to skip entity listeners (password already hashed)
    await userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(batch)
      .execute();

    console.log(`Inserted users ${i + 1} to ${Math.min(i + batchSize, users.length)}`);
  }

  // Fetch all created users
  const allUsers = await userRepository.find();
  console.log(`Created ${allUsers.length} users`);

  return allUsers;
}
