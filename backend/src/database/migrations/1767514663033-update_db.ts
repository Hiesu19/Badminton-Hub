import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDb1767514663033 implements MigrationInterface {
    name = 'UpdateDb1767514663033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('pending', 'confirmed', 'rejected', 'cancelled', 'locked') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('pending', 'confirmed', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending'`);
    }

}
