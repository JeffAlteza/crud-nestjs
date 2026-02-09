import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleTableAndPivot1770259390665 implements MigrationInterface {
    name = 'CreateRoleTableAndPivot1770259390665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create roles table
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_roles_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);

        // Create pivot table (user_roles)
        await queryRunner.query(`CREATE TABLE \`user_roles\` (\`user_id\` int NOT NULL, \`role_id\` int NOT NULL, PRIMARY KEY (\`user_id\`, \`role_id\`), INDEX \`IDX_user_roles_user_id\` (\`user_id\`), INDEX \`IDX_user_roles_role_id\` (\`role_id\`)) ENGINE=InnoDB`);

        // Add foreign keys
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_user_roles_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_user_roles_role_id\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_user_roles_role_id\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_user_roles_user_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_user_roles_role_id\` ON \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_user_roles_user_id\` ON \`user_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_roles_name\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
