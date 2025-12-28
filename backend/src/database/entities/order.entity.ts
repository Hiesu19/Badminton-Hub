import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SubCourtEntity } from './sub-court.entity';
import { OrderStatus } from '../../shared/enums/order.enum';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus = OrderStatus.PENDING;

  @Column({
    type: 'timestamp',
    name: 'start_time',
    comment: 'Thời gian bắt đầu thuê sân',
  })
  startTime: Date;

  @Column({
    type: 'timestamp',
    name: 'end_time',
    comment: 'Thời gian kết thúc thuê sân',
  })
  endTime: Date;

  @Column({
    type: 'timestamp',
    name: 'payment_expire_at',
    comment: 'Hạn thanh toán (tối đa sau 5 phút kể từ khi tạo order)',
  })
  paymentExpireAt: Date;

  @Column({
    type: 'int',
    name: 'total_price',
    comment: 'Tổng tiền đơn đặt sân (VNĐ)',
  })
  totalPrice: number;

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

  @ManyToOne(() => SubCourtEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sub_court_id' })
  subCourt: SubCourtEntity;
}
