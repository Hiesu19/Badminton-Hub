import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrice1765795740200 implements MigrationInterface {
    name = 'AddPrice1765795740200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sub_courts\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`supper_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supper_court_prices\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`dayOfWeek\` tinyint NULL, \`startTime\` time NOT NULL, \`endTime\` time NOT NULL, \`price_per_hour\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`supper_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sub_courts\` ADD CONSTRAINT \`FK_6a1c91555cf60a3c6c08e6df8e6\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`supper_court_prices\` ADD CONSTRAINT \`FK_9ab6dc0861054aecaeac3cb7651\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_court_prices\` DROP FOREIGN KEY \`FK_9ab6dc0861054aecaeac3cb7651\``);
        await queryRunner.query(`ALTER TABLE \`sub_courts\` DROP FOREIGN KEY \`FK_6a1c91555cf60a3c6c08e6df8e6\``);
        await queryRunner.query(`DROP TABLE \`supper_court_prices\``);
        await queryRunner.query(`DROP TABLE \`sub_courts\``);
    }

}
