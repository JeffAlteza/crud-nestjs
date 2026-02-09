import { DataSource } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { User } from '../../users/entities/user.entity';

export async function seedProfiles(dataSource: DataSource, users: User[]): Promise<void> {
  const profileRepository = dataSource.getRepository(Profile);

  const profilesData = [
    {
      bio: 'System administrator with 10 years of experience',
      avatar: 'https://example.com/avatars/admin.jpg',
      phone: '+1234567890',
      address: '123 Admin Street, Tech City',
    },
    {
      bio: 'Full-stack developer passionate about NestJS',
      avatar: 'https://example.com/avatars/john.jpg',
      phone: '+1987654321',
      address: '456 Developer Lane, Code Town',
    },
    {
      bio: 'UI/UX designer creating beautiful experiences',
      avatar: 'https://example.com/avatars/jane.jpg',
      phone: '+1122334455',
      address: '789 Design Avenue, Creative City',
    },
  ];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const profileData = profilesData[i];

    if (!profileData) continue;

    const existingProfile = await profileRepository.findOneBy({ userId: user.id });

    if (!existingProfile) {
      const profile = profileRepository.create({
        ...profileData,
        userId: user.id,
      });
      await profileRepository.save(profile);
      console.log(`Created profile for user: ${user.email}`);
    } else {
      console.log(`Profile already exists for user: ${user.email}`);
    }
  }
}
