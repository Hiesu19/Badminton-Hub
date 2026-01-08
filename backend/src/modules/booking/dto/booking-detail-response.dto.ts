import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  BookingItemResponseDto,
  BookingSupperCourtResponseDto,
  BookingUserResponseDto,
} from './list-booking-query.dto';

@Exclude()
export class BookingDetailResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'Id booking' })
  id: number;

  @Expose()
  @ApiProperty({
    example: 'Ghi chú đặc biệt',
    description: 'Ghi chú',
    nullable: true,
  })
  note: string | null;

  @Expose()
  @ApiProperty({ example: 10000000, description: 'Tổng giá (VNĐ)' })
  totalPrice: number;

  @Expose()
  @ApiProperty({
    example: 'https://example.com/bill.jpg',
    description: 'URL ảnh bill',
    nullable: true,
  })
  imgBill: string | null;

  @Expose()
  @ApiProperty({ example: 'pending', description: 'Trạng thái booking' })
  status: string;

  @Expose()
  @ApiProperty({
    example: '2026-01-15T10:00:00Z',
    description: 'Thời gian hết hạn',
  })
  expiredAt: Date;

  @Expose()
  @ApiProperty({
    example: '2026-01-04T03:38:14.661Z',
    description: 'Thời gian tạo',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2026-01-04T03:38:14.661Z',
    description: 'Thời gian cập nhật',
  })
  updatedAt: Date;

  @Expose()
  @Type(() => BookingUserResponseDto)
  @ApiProperty({
    type: BookingUserResponseDto,
    description: 'Thông tin người dùng',
  })
  user: BookingUserResponseDto;

  @Expose()
  @Type(() => BookingSupperCourtResponseDto)
  @ApiProperty({
    type: BookingSupperCourtResponseDto,
    description: 'Thông tin cụm sân',
  })
  supperCourt: BookingSupperCourtResponseDto;

  @Expose()
  @Type(() => BookingItemResponseDto)
  @ApiProperty({
    type: [BookingItemResponseDto],
    description: 'Danh sách các mục đặt sân',
  })
  items: BookingItemResponseDto[];
}
