import { MigrationInterface, QueryRunner } from "typeorm";

export class Init21765294817707 implements MigrationInterface {
    name = 'Init21765294817707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_630a929bfca852d724cb66820b\` ON \`users\` (\`email\`, \`role\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_630a929bfca852d724cb66820b\` ON \`users\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`);
    }

}
