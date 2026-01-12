import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatus1768207270275 implements MigrationInterface {
    name = 'UpdateStatus1768207270275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('pending', 'confirmed', 'rejected', 'cancelled', 'out_of_system', 'locked') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('pending', 'confirmed', 'rejected', 'cancelled', 'locked') NOT NULL DEFAULT 'pending'`);
    }

}
