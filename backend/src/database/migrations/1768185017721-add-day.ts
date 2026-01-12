import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDay1768185017721 implements MigrationInterface {
    name = 'AddDay1768185017721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`createdAt\``);
    }

}
