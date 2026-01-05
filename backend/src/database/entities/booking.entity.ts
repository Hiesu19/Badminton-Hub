import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '../../shared/enums/booking.enum';
import { SupperCourtEntity } from './supper-court.entity';
import { UserEntity } from './user.entity';
import { BookingItemEntity } from './booking-item.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  note?: string;

  @Column({ name: 'total_price', type: 'int' })
  totalPrice: number;

  @Column({ name: 'img_bill', type: 'varchar', length: 500, nullable: true })
  imgBill?: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus = BookingStatus.PENDING;

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

  @ManyToOne(() => UserEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => SupperCourtEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supper_court_id' })
  supperCourt: SupperCourtEntity;

  @OneToMany(() => BookingItemEntity, (item) => item.booking, { cascade: true })
  items: BookingItemEntity[];
}

