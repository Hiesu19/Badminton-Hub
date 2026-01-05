import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767499873854 implements MigrationInterface {
    name = 'Init1767499873854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`role\` enum ('owner', 'user', 'super_admin') NOT NULL DEFAULT 'user', \`isActive\` tinyint NOT NULL DEFAULT 1, \`token_version\` int NOT NULL DEFAULT '1', \`avatar_url\` varchar(500) NOT NULL DEFAULT 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2bbff8c14e6b2f7067f1891ad7\` (\`email\`, \`role\`, \`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`images\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NOT NULL, \`url\` varchar(500) NOT NULL, \`type\` enum ('supper_court', 'avatar', 'banner') NOT NULL, \`priority\` int NOT NULL DEFAULT '1', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`supper_court_id\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sub_courts\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`supper_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supper_court_prices\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`dayOfWeek\` tinyint NULL, \`startTime\` time NOT NULL, \`endTime\` time NOT NULL, \`price_per_hour\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`supper_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supper_courts\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`address_link\` varchar(255) NOT NULL, \`latitude\` decimal(10,8) NOT NULL, \`longitude\` decimal(11,8) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`website\` varchar(255) NULL, \`bank_name\` varchar(255) NOT NULL, \`bank_account_number\` varchar(255) NOT NULL, \`image_url\` varchar(500) NOT NULL DEFAULT 'https://thumbs.dreamstime.com/b/badminton-court-vector-illustration-empty-net-middle-65759284.jpg', \`user_id\` bigint NULL, UNIQUE INDEX \`REL_d65818889b1276973b848b6c18\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`rating\` int NOT NULL COMMENT 'Điểm đánh giá (1-5 sao)', \`comment\` varchar(1000) NULL COMMENT 'Nội dung đánh giá', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` bigint NOT NULL, \`supper_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booking_items\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, \`price\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`booking_id\` bigint NOT NULL, \`sub_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookings\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`note\` varchar(1000) NULL, \`total_price\` int NOT NULL, \`img_bill\` varchar(500) NULL, \`status\` enum ('pending', 'confirmed', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` bigint NOT NULL, \`supper_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_28720dd17348187d4ebf45a5c74\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sub_courts\` ADD CONSTRAINT \`FK_6a1c91555cf60a3c6c08e6df8e6\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`supper_court_prices\` ADD CONSTRAINT \`FK_9ab6dc0861054aecaeac3cb7651\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` ADD CONSTRAINT \`FK_d65818889b1276973b848b6c188\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_728447781a30bc3fcfe5c2f1cdf\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_cf7648e0b064ca370d1cd123b3d\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking_items\` ADD CONSTRAINT \`FK_ef31cb9266b7deb19ad60847479\` FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking_items\` ADD CONSTRAINT \`FK_5dca8be2d7404b7de9634554385\` FOREIGN KEY (\`sub_court_id\`) REFERENCES \`sub_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_64cd97487c5c42806458ab5520c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_7d1d761c71e34806f5948dad78c\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_7d1d761c71e34806f5948dad78c\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_64cd97487c5c42806458ab5520c\``);
        await queryRunner.query(`ALTER TABLE \`booking_items\` DROP FOREIGN KEY \`FK_5dca8be2d7404b7de9634554385\``);
        await queryRunner.query(`ALTER TABLE \`booking_items\` DROP FOREIGN KEY \`FK_ef31cb9266b7deb19ad60847479\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_cf7648e0b064ca370d1cd123b3d\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_728447781a30bc3fcfe5c2f1cdf\``);
        await queryRunner.query(`ALTER TABLE \`supper_courts\` DROP FOREIGN KEY \`FK_d65818889b1276973b848b6c188\``);
        await queryRunner.query(`ALTER TABLE \`supper_court_prices\` DROP FOREIGN KEY \`FK_9ab6dc0861054aecaeac3cb7651\``);
        await queryRunner.query(`ALTER TABLE \`sub_courts\` DROP FOREIGN KEY \`FK_6a1c91555cf60a3c6c08e6df8e6\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_28720dd17348187d4ebf45a5c74\``);
        await queryRunner.query(`DROP TABLE \`bookings\``);
        await queryRunner.query(`DROP TABLE \`booking_items\``);
        await queryRunner.query(`DROP TABLE \`reviews\``);
        await queryRunner.query(`DROP INDEX \`REL_d65818889b1276973b848b6c18\` ON \`supper_courts\``);
        await queryRunner.query(`DROP TABLE \`supper_courts\``);
        await queryRunner.query(`DROP TABLE \`supper_court_prices\``);
        await queryRunner.query(`DROP TABLE \`sub_courts\``);
        await queryRunner.query(`DROP TABLE \`images\``);
        await queryRunner.query(`DROP INDEX \`IDX_2bbff8c14e6b2f7067f1891ad7\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
