import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/shared/enums/user.enum';

@Exclude()
export class AdminUserDetailResponseDto {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Nguyen Van A' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: '0123456789', nullable: true })
  phone: string | null;

  @Expose()
  @ApiProperty({ example: UserRole.USER })
  role: UserRole;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiPropertyOptional({ example: 'https://...' })
  avatarUrl: string;

  @Expose()
  @ApiPropertyOptional({ example: new Date() })
  createdAt: Date;

  @Expose()
  @ApiPropertyOptional({ example: new Date() })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ example: 5, description: 'Tổng số booking đã đặt' })
  bookingCount: number;

  @Expose()
  @ApiProperty({
    example: 3,
    description: 'Số sân khác nhau đã được user đặt (có thể trùng nhiều booking)',
  })
  bookedCourtCount: number;
}

