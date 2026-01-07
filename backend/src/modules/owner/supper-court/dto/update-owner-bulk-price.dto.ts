import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class UpdateOwnerBulkPriceDto {
  @ApiProperty({
    example: 1,
    description: 'Thứ áp dụng: 0 = CN, 1 = Thứ 2, ..., 6 = Thứ 7',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '08:00', description: 'Giờ bắt đầu (HH:mm hoặc HH:mm:ss)' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '14:00', description: 'Giờ kết thúc (HH:mm hoặc HH:mm:ss)' })
  @IsString()
  endTime: string;

  @ApiProperty({ example: 120000, description: 'Giá theo giờ (VNĐ / giờ)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pricePerHour: number;
}

