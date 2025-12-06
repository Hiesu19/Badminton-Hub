import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageEntity } from './court-image.entity';
import { ImageDefaultEnum } from '../../shared/enums/image.enum';
import { UserEntity } from './user.entity';

@Entity('supper_courts')
export class SupperCourtEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ name: 'address_link', type: 'varchar', length: 255 })
  addressLink: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ name: 'bank_name', type: 'varchar', length: 255 })
  bankName: string;

  @Column({ name: 'bank_account_number', type: 'varchar', length: 255 })
  bankAccountNumber: string;

  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 500,
    default: ImageDefaultEnum.DEFAULT_SUPPER_COURT,
  })
  imageUrl: string | null;

  // -----------------------------
  @OneToMany(() => ImageEntity, (image) => image.supperCourt)
  images: ImageEntity[];

  @OneToOne(() => UserEntity, (user) => user.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
