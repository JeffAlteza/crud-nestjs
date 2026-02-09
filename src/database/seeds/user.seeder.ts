import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      age: 30,
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      age: 25,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      age: 28,
    },
  ];

  const createdUsers: User[] = [];

  for (const userData of users) {
    const existingUser = await userRepository.findOneBy({ email: userData.email });

    if (!existingUser) {
      const user = userRepository.create(userData);
      const savedUser = await userRepository.save(user);
      createdUsers.push(savedUser);
      console.log(`Created user: ${userData.email}`);
    } else {
      createdUsers.push(existingUser);
      console.log(`User already exists: ${userData.email}`);
    }
  }

  return createdUsers;
}
