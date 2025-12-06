import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserSupperCourt1765038043360 implements MigrationInterface {
    name = 'AddUserSupperCourt1765038043360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`role\` enum ('owner', 'user', 'super_admin', 'staff') NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`avatar_url\` varchar(500) NOT NULL DEFAULT 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`images\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NOT NULL, \`url\` varchar(500) NOT NULL, \`type\` enum ('supper_court', 'avatar', 'banner') NOT NULL, \`priority\` int NOT NULL DEFAULT '1', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`supper_court_id\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supper_courts\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`address_link\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`website\` varchar(255) NULL, \`bank_name\` varchar(255) NOT NULL, \`bank_account_number\` varchar(255) NOT NULL, \`image_url\` varchar(500) NOT NULL DEFAULT 'https://thumbs.dreamstime.com/b/badminton-court-vector-illustration-empty-net-middle-65759284.jpg', \`user_id\` bigint NULL, UNIQUE INDEX \`REL_d65818889b1276973b848b6c18\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_28720dd17348187d4ebf45a5c74\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD CONSTRAINT \`FK_d65818889b1276973b848b6c188\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP FOREIGN KEY \`FK_d65818889b1276973b848b6c188\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_28720dd17348187d4ebf45a5c74\``);
        await queryRunner.query(`DROP INDEX \`REL_d65818889b1276973b848b6c18\` ON \`supper_courts\``);
        await queryRunner.query(`DROP TABLE \`supper_courts\``);
        await queryRunner.query(`DROP TABLE \`images\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
