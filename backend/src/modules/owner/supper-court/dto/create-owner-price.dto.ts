import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateOwnerPriceDto {
  @ApiPropertyOptional({
    example: 1,
    description: '0 = CN, 1 = Thứ 2, ..., 6 = Thứ 7, null = mọi ngày',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number | null;

  @ApiProperty({ example: '06:00:00', description: 'Giờ bắt đầu (HH:MM:SS)' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '10:00:00', description: 'Giờ kết thúc (HH:MM:SS)' })
  @IsString()
  endTime: string;

  @ApiProperty({ example: 120000, description: 'Giá theo giờ (VNĐ / giờ)' })
  @IsInt()
  @Min(0)
  pricePerHour: number;
}
