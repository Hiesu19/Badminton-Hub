import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateBookingItemDto {
  @ApiProperty({
    description: 'Ngày thuê sân theo định dạng YYYY-MM-DD',
    example: '2026-01-05',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Id của sub-court', example: '1' })
  @IsString()
  @IsNotEmpty()
  courtId: string;

  @ApiProperty({
    description: 'Giờ bắt đầu theo chuẩn 24h (HH:mm)',
    example: '15:30',
  })
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({
    description: 'Giờ kết thúc theo chuẩn 24h (HH:mm)',
    example: '17:30',
  })
  @IsMilitaryTime()
  endTime: string;

  @ApiProperty({
    description: 'Giá thuê trong mục (VNĐ)',
    example: 200000,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;
}
