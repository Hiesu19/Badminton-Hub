import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class OwnerCoverageResponseDto {
  @Expose()
  @ApiProperty({ example: '2026-01-12', description: 'Ngày cần tính độ phủ' })
  date: string;

  @Expose()
  @ApiProperty({
    example: 5.5,
    description: 'Tổng số giờ được đặt trong ngày (tính theo booking_items)',
  })
  bookedHours: number;

  @Expose()
  @ApiProperty({
    example: 48,
    description: 'Tổng số giờ khả dụng (số sân * 24)',
  })
  availableHours: number;

  @Expose()
  @ApiProperty({
    example: 0.125,
    description: 'Tỷ lệ phủ giờ = bookedHours / availableHours',
  })
  percentage: number;
}
