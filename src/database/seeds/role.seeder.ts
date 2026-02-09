import { DataSource } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';

export async function seedRoles(dataSource: DataSource, users: User[]): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);

  // Predefined roles
  const rolesData = [
    { name: 'admin', description: 'Administrator with full access' },
    { name: 'user', description: 'Regular user with basic access' },
    { name: 'editor', description: 'Can edit and publish content' },
    { name: 'moderator', description: 'Can moderate user content' },
    { name: 'viewer', description: 'Can only view content' },
    { name: 'contributor', description: 'Can contribute content for review' },
    { name: 'manager', description: 'Can manage teams and projects' },
    { name: 'analyst', description: 'Can view analytics and reports' },
    { name: 'support', description: 'Customer support representative' },
    { name: 'developer', description: 'Developer access for APIs' },
  ];

  // Create roles if they don't exist
  let createdRoles: Role[] = await roleRepository.find();

  if (createdRoles.length === 0) {
    console.log('Creating 10 roles...');

    for (const roleData of rolesData) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    }

    createdRoles = await roleRepository.find();
  } else {
    console.log(`Roles already exist (${createdRoles.length} found).`);
  }

  // Check if users already have roles assigned
  const userWithRoles = await userRepository.findOne({
    where: { id: users[0]?.id },
    relations: ['roles'],
  });

  if ((userWithRoles?.roles?.length ?? 0) > 0) {
    console.log('Users already have roles assigned. Skipping role assignment...');
    return;
  }

  // Assign 1-5 random roles to each user
  console.log(`Assigning 1-5 random roles to ${users.length} users...`);

  const batchSize = 100;
  let processedCount = 0;

  for (let i = 0; i < users.length; i += batchSize) {
    const batchUsers = users.slice(i, i + batchSize);

    for (const user of batchUsers) {
      // Get 1-5 random roles for this user
      const numRoles = faker.number.int({ min: 1, max: 5 });
      const shuffledRoles = faker.helpers.shuffle([...createdRoles]);
      const userRoles = shuffledRoles.slice(0, numRoles);

      // Use query builder for direct pivot table insert (faster)
      for (const role of userRoles) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into('user_roles')
          .values({ user_id: user.id, role_id: role.id })
          .orIgnore() // Skip if already exists
          .execute();
      }
    }

    processedCount += batchUsers.length;
    console.log(`Assigned roles to users ${i + 1} to ${Math.min(i + batchSize, users.length)}`);
  }

  console.log(`Completed role assignment for ${users.length} users`);
}
