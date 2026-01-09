import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class ListMyBookingByDateDto {
  @ApiProperty({
    example: '2026-01-15',
    description: 'Ngày cần lấy booking của user (YYYY-MM-DD)',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Trang hiện tại (mặc định = 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Số bản ghi mỗi trang (mặc định = 10)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
