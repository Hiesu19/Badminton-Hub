import { ImageDefaultEnum } from '../../shared/enums/image.enum';
import { UserRole } from '../../shared/enums/user.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupperCourtEntity } from './supper-court.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole = UserRole.USER;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 500,
    default: ImageDefaultEnum.DEFAULT_AVATAR,
  })
  avatarUrl: string;

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


    // -----------------------------
}
