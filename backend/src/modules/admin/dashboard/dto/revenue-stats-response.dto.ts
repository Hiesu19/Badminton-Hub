import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RevenueStatsResponseDto {
  @Expose()
  @ApiProperty({ example: 1500000, description: 'Doanh thu trong ngày' })
  today: number;

  @Expose()
  @ApiProperty({
    example: 4500000,
    description: 'Doanh thu trong tuần hiện tại',
  })
  week: number;

  @Expose()
  @ApiProperty({
    example: 12000000,
    description: 'Doanh thu trong tháng hiện tại',
  })
  month: number;
}
