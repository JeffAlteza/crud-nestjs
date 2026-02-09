import { DataSource } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';

export async function seedProfiles(dataSource: DataSource, users: User[]): Promise<void> {
  const profileRepository = dataSource.getRepository(Profile);

  // Check if profiles already exist
  const existingCount = await profileRepository.count();
  if (existingCount > 0) {
    console.log(`Profiles already exist (${existingCount} found). Skipping...`);
    return;
  }

  console.log(`Generating ${users.length} profiles with faker...`);

  const profiles: Partial<Profile>[] = [];
  const batchSize = 100;

  for (const user of users) {
    profiles.push({
      bio: faker.lorem.paragraph(),
      avatar: faker.image.avatar(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      userId: user.id,
    });
  }

  // Insert in batches for better performance
  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);

    await profileRepository
      .createQueryBuilder()
      .insert()
      .into(Profile)
      .values(batch)
      .execute();

    console.log(`Inserted profiles ${i + 1} to ${Math.min(i + batchSize, profiles.length)}`);
  }

  console.log(`Created ${profiles.length} profiles`);
}
