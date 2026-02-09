import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfileTable1770259390663 implements MigrationInterface {
    name = 'CreateProfileTable1770259390663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bio\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`address\` varchar(255) NULL, \`user_id\` int NOT NULL, UNIQUE INDEX \`REL_profiles_user_id\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD CONSTRAINT \`FK_profiles_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP FOREIGN KEY \`FK_profiles_user_id\``);
        await queryRunner.query(`DROP INDEX \`REL_profiles_user_id\` ON \`profiles\``);
        await queryRunner.query(`DROP TABLE \`profiles\``);
    }

}
