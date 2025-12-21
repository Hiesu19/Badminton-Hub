import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOwner1766332789266 implements MigrationInterface {
    name = 'AddOwner1766332789266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_630a929bfca852d724cb66820b\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_2bbff8c14e6b2f7067f1891ad7\` ON \`users\` (\`email\`, \`role\`, \`phone\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_2bbff8c14e6b2f7067f1891ad7\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP COLUMN \`description\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\` (\`phone\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_630a929bfca852d724cb66820b\` ON \`users\` (\`email\`, \`role\`)`);
    }

}
