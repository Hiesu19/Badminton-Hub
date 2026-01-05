import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateBookingItemDto } from './create-booking-item.dto';

export class CreateBookingDto {
  @ApiPropertyOptional({
    description: 'Ghi chú thêm từ khách hàng',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Tổng giá tiền của booking (không âm)',
    example: 500000,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalPrice: number;

  @ApiPropertyOptional({
    description: 'Id của supper court nếu cần ép cụm sân',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  supperCourtId?: string;

  @ApiProperty({
    description: 'Danh sách các mục thuê sân (ít nhất 1)',
    type: [CreateBookingItemDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingItemDto)
  items: CreateBookingItemDto[];
}
