import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BookingStatus } from 'src/shared/enums/booking.enum';

export class PublicSupperCourtBookingMatrixSlotDto {
  @ApiProperty({
    description: 'Thời gian bắt đầu slot',
    example: '05:00',
  })
  @Expose()
  startTime: string;

  @ApiProperty({
    description: 'Thời gian kết thúc slot',
    example: '05:30',
  })
  @Expose()
  endTime: string;

  @ApiProperty({
    description: 'BookingId nếu slot đang bị đặt',
    nullable: true,
  })
  @Expose()
  bookingId: number | null;

  @ApiProperty({
    description: 'Trạng thái booking (nếu có)',
    enum: BookingStatus,
    nullable: true,
    example: BookingStatus.PENDING,
  })
  @Expose()
  status: BookingStatus | null;

  @ApiProperty({
    description: 'Giá slot (nếu có)',
    nullable: true,
    example: 200000,
  })
  @Expose()
  price: number | null;
}

export class PublicSupperCourtBookingMatrixSubCourtDto {
  @ApiProperty({ description: 'Id của sub court', example: 1 })
  @Expose()
  subCourtId: number;

  @ApiProperty({ description: 'Tên sub court', example: 'Sân 1' })
  @Expose()
  subCourtName: string;

  @ApiProperty({
    description: '48 slot của sân con trong ngày',
    type: [PublicSupperCourtBookingMatrixSlotDto],
  })
  @Expose()
  @Type(() => PublicSupperCourtBookingMatrixSlotDto)
  map: PublicSupperCourtBookingMatrixSlotDto[];
}

export class PublicSupperCourtBookingMatrixResponseDto {
  @ApiProperty({
    description: 'Ngày lấy lịch',
    example: '2026-01-06',
  })
  @Expose()
  date: string;

  @ApiProperty({
    description: 'Danh sách sân con kèm ma trận 48 slot',
    type: [PublicSupperCourtBookingMatrixSubCourtDto],
  })
  @Expose()
  @Type(() => PublicSupperCourtBookingMatrixSubCourtDto)
  subCourts: PublicSupperCourtBookingMatrixSubCourtDto[];
}
