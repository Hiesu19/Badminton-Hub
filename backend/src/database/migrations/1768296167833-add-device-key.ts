import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceKey1768296167833 implements MigrationInterface {
    name = 'AddDeviceKey1768296167833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`device_key\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`device_key\``);
    }

}
