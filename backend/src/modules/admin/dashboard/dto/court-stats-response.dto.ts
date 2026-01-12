import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CourtStatsResponseDto {
  @Expose()
  @ApiProperty({ example: 12, description: 'Tổng số sân trong hệ thống' })
  totalCourts: number;

  @Expose()
  @ApiProperty({
    example: 3,
    description: 'Số sân đang chờ phê duyệt (trạng thái verifying)',
  })
  pendingCourts: number;
}
