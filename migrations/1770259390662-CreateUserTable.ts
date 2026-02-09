import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1770259390662 implements MigrationInterface {
    name = 'CreateUserTable1770259390662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`age\` int NULL, \`email\` varchar(255) NULL UNIQUE, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
