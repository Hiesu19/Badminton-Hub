import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupperCourtEntity } from './supper-court.entity';

/**
 * Bảng lưu cấu hình giá theo khung giờ cho từng cụm sân (supper_court).
 *
 * Ví dụ:
 * - dayOfWeek = null  => áp dụng tất cả các ngày
 * - dayOfWeek = 1     => chỉ áp dụng thứ 2 (0 = Chủ nhật, 1 = Thứ 2, ... 6 = Thứ 7)
 * - startTime = '06:00:00', endTime = '10:00:00' => khung giờ 6h-10h
 */
@Entity('supper_court_prices')
export class SupperCourtPriceEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => SupperCourtEntity, (court) => court.prices, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supper_court_id' })
  supperCourt: SupperCourtEntity;

  /**
   * 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7, null = áp dụng cho tất cả các ngày.
   */
  @Column({ type: 'tinyint', nullable: true })
  dayOfWeek: number | null;

  /**
   * Giờ bắt đầu của khung giá, format HH:MM:SS.
   */
  @Column({ type: 'time' })
  startTime: string;

  /**
   * Giờ kết thúc của khung giá, format HH:MM:SS.
   */
  @Column({ type: 'time' })
  endTime: string;

  /**
   * Giá theo giờ cho khung này (VNĐ / giờ).
   */
  @Column({ name: 'price_per_hour', type: 'int' })
  pricePerHour: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
