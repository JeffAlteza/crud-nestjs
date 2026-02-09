import { DataSource } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

export async function seedRoles(dataSource: DataSource, users: User[]): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);

  const rolesData = [
    { name: 'admin', description: 'Administrator with full access' },
    { name: 'user', description: 'Regular user with basic access' },
    { name: 'editor', description: 'Can edit and publish content' },
    { name: 'moderator', description: 'Can moderate user content' },
  ];

  const createdRoles: Role[] = [];

  // Create roles
  for (const roleData of rolesData) {
    let role = await roleRepository.findOneBy({ name: roleData.name });

    if (!role) {
      role = await roleRepository.save(roleData);
      console.log(`Created role: ${roleData.name}`);
    } else {
      console.log(`Role already exists: ${roleData.name}`);
    }

    createdRoles.push(role);
  }

  // Assign roles to users
  const roleAssignments = [
    { userIndex: 0, roleNames: ['admin', 'user'] },      // Admin User gets admin + user
    { userIndex: 1, roleNames: ['user', 'editor'] },    // John gets user + editor
    { userIndex: 2, roleNames: ['user'] },              // Jane gets user only
  ];

  for (const assignment of roleAssignments) {
    if (users[assignment.userIndex]) {
      const user = await userRepository.findOne({
        where: { id: users[assignment.userIndex].id },
        relations: ['roles'],
      });

      if (user && (!user.roles || user.roles.length === 0)) {
        const rolesToAssign = createdRoles.filter((r) =>
          assignment.roleNames.includes(r.name),
        );
        user.roles = rolesToAssign;
        await userRepository.save(user);
        console.log(`Assigned roles [${assignment.roleNames.join(', ')}] to user: ${user.email}`);
      } else if (user) {
        console.log(`User ${user.email} already has roles assigned`);
      }
    }
  }
}
