import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLatiLongi1767363684134 implements MigrationInterface {
    name = 'AddLatiLongi1767363684134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`latitude\` decimal(10,8) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`longitude\` decimal(10,8) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`longitude\``);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`latitude\``);
    }

}
