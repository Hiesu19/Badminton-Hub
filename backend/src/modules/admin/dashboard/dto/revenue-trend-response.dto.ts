import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class RevenueTrendItemDto {
  @Expose()
  @ApiProperty({
    description: 'Ngày theo chuẩn YYYY-MM-DD',
    example: '2026-01-12',
  })
  date: string;

  @Expose()
  @ApiProperty({
    description: 'Doanh thu trong ngày (VNĐ)',
    example: 1250000,
  })
  revenue: number;
}

@Exclude()
export class RevenueTrendResponseDto {
  @Expose()
  @Type(() => RevenueTrendItemDto)
  @ApiProperty({
    description: 'Danh sách doanh thu theo ngày trong 7 ngày gần nhất',
    type: [RevenueTrendItemDto],
  })
  items: RevenueTrendItemDto[];
}
