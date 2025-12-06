import { CourtImageType } from '../../shared/enums/court.enum';
import { SupperCourtEntity } from './supper-court.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'enum', enum: CourtImageType })
  type: CourtImageType;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @ManyToOne(() => SupperCourtEntity, (court) => court.images, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supper_court_id' })
  supperCourt?: SupperCourtEntity;

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
