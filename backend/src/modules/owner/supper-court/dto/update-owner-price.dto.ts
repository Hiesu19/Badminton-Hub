import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateOwnerPriceDto {
  @ApiProperty({ example: 120000, description: 'Giá theo giờ (VNĐ / giờ)' })
  @IsInt()
  @Min(0)
  pricePerHour: number;
}
