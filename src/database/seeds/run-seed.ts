import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../profiles/entities/profile.entity';
import { seedUsers } from './user.seeder';
import { seedProfiles } from './profile.seeder';

config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Profile],
  synchronize: false,
});

async function runSeeders() {
  try {
    await dataSource.initialize();
    console.log('Database connected successfully\n');

    console.log('--- Seeding Users ---');
    const users = await seedUsers(dataSource);
    console.log('');

    console.log('--- Seeding Profiles ---');
    await seedProfiles(dataSource, users);
    console.log('');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeeders();
