import { ImageDefaultEnum } from '../../shared/enums/image.enum';
import { UserRole } from '../../shared/enums/user.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Unique(['email', 'role'])
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  phone: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole = UserRole.USER;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @Column({ type: 'int', name: 'token_version', default: 1 })
  tokenVersion: number;

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

// Alias để các module có thể import `User` (giống code hiện tại)
export { UserEntity as User };
