import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BookingStatus } from '../../../shared/enums/booking.enum';

export class ListOwnerBookingQueryDto {
  @ApiPropertyOptional({
    example: 'pending',
    description: 'Trạng thái để lọc (nếu không truyền thì lấy tất cả)',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Lọc booking tạo từ ngày (inclusive), định dạng YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-01-31',
    description: 'Lọc booking tạo đến ngày (inclusive), định dạng YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Trang cần lấy',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Số booking mỗi trang',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
