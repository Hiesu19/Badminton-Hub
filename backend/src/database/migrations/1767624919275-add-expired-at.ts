import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiredAt1767624919275 implements MigrationInterface {
    name = 'AddExpiredAt1767624919275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD \`expired_at\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP COLUMN \`expired_at\``);
    }

}
