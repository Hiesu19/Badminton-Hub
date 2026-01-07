import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQr1767626022549 implements MigrationInterface {
    name = 'AddQr1767626022549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`qr_code_url\` varchar(500) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`qr_code_url\``);
    }

}
