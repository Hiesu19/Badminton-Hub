import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderPaymentReview1766907547341 implements MigrationInterface {
    name = 'AddOrderPaymentReview1766907547341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` enum ('pending', 'verifying', 'done', 'cancelled', 'cancelled_by_owner') NOT NULL DEFAULT 'pending', \`start_time\` timestamp NOT NULL COMMENT 'Thời gian bắt đầu thuê sân', \`end_time\` timestamp NOT NULL COMMENT 'Thời gian kết thúc thuê sân', \`payment_expire_at\` timestamp NOT NULL COMMENT 'Hạn thanh toán (tối đa sau 5 phút kể từ khi tạo order)', \`total_price\` int NOT NULL COMMENT 'Tổng tiền đơn đặt sân (VNĐ)', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` bigint NOT NULL, \`sub_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` enum ('pending', 'paid', 'failed', 'expired') NOT NULL DEFAULT 'pending', \`bill_image_url\` varchar(500) NULL COMMENT 'Link ảnh/bill chuyển khoản mà user đã chuyển', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` bigint NOT NULL, UNIQUE INDEX \`REL_b2f7b823a21562eeca20e72b00\` (\`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`rating\` int NOT NULL COMMENT 'Điểm đánh giá (1-5 sao)', \`comment\` varchar(1000) NULL COMMENT 'Nội dung đánh giá', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` bigint NOT NULL, \`supper_court_id\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_5bd472e7a91a103a34dd45a4c92\` FOREIGN KEY (\`sub_court_id\`) REFERENCES \`sub_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_b2f7b823a21562eeca20e72b006\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_728447781a30bc3fcfe5c2f1cdf\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_cf7648e0b064ca370d1cd123b3d\` FOREIGN KEY (\`supper_court_id\`) REFERENCES \`supper_courts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_cf7648e0b064ca370d1cd123b3d\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_728447781a30bc3fcfe5c2f1cdf\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_b2f7b823a21562eeca20e72b006\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_5bd472e7a91a103a34dd45a4c92\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`DROP TABLE \`reviews\``);
        await queryRunner.query(`DROP INDEX \`REL_b2f7b823a21562eeca20e72b00\` ON \`payments\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
