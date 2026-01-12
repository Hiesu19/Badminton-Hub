import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTypeImg1768231045540 implements MigrationInterface {
    name = 'UpdateTypeImg1768231045540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`images\` CHANGE \`type\` \`type\` enum ('supper_court', 'gallery', 'avatar', 'banner') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`images\` CHANGE \`type\` \`type\` enum ('supper_court', 'avatar', 'banner') NOT NULL`);
    }

}
