import { ApiProperty } from '@nestjs/swagger';
import { BookingItemEntity } from '../../../database/entities/booking-item.entity';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';

export class CreateBookingResponseDto {
  @ApiProperty({ description: 'Id booking vừa tạo', example: 123 })
  id: number;

  @ApiProperty({
    description: 'Ghi chú liên quan tới booking',
    nullable: true,
  })
  note?: string;

  @ApiProperty({ description: 'Tổng tiền booking (VNĐ)' })
  totalPrice: number;

  @ApiProperty({ description: 'Trạng thái hiện tại của booking' })
  status: string;

  @ApiProperty({
    description: 'Thời điểm hết hạn thanh toán',
    example: '2026-01-04T12:00:00.000Z',
  })
  expiredAt: string;

  @ApiProperty({ description: 'Ngày tạo' })
  createdAt: string;

  @ApiProperty({ description: 'Ngày cập nhật' })
  updatedAt: string;

  @ApiProperty({
    description: 'Danh sách mục thuê',
    type: [BookingItemEntity],
  })
  items: BookingItemEntity[];

  @ApiProperty({
    description: 'Thông tin supper court kèm QR',
    type: SupperCourtEntity,
  })
  supperCourt: SupperCourtEntity;
}
