import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BookingStatus } from 'src/shared/enums/booking.enum';

@Expose()
export class OwnerDashboardResponseDto {
  @Expose()
  @ApiProperty({ example: 12, description: 'Số booking trong ngày' })
  dailyBookingCount: number;

  @Expose()
  @ApiProperty({ example: 78, description: 'Số booking trong tuần hiện tại' })
  weeklyBookingCount: number;

  @Expose()
  @ApiProperty({ example: 152, description: 'Số booking trong tháng hiện tại' })
  monthlyBookingCount: number;

  @Expose()
  @ApiProperty({ example: 3500000, description: 'Doanh thu trong ngày (VNĐ)' })
  dailyRevenue: number;

  @Expose()
  @ApiProperty({ example: 20000000, description: 'Doanh thu trong tuần (VNĐ)' })
  weeklyRevenue: number;

  @Expose()
  @ApiProperty({
    example: 82000000,
    description: 'Doanh thu trong tháng (VNĐ)',
  })
  monthlyRevenue: number;

  @Expose()
  @ApiProperty({
    example: 980,
    description: 'Tổng số booking của owner kể từ khi tạo sân',
  })
  totalBookings: number;

  @Expose()
  @ApiProperty({
    example: 150000000,
    description: 'Doanh thu toàn kỳ (VNĐ)',
  })
  totalRevenue: number;

  @Expose()
  @ApiProperty({
    example: 42,
    description: 'Số khách hàng riêng biệt đã đặt sân',
  })
  uniqueCustomers: number;

  @Expose()
  @ApiProperty({
    example: 8,
    description: 'Số sân khác nhau do owner đang quản lý có booking',
  })
  bookedCourtCount: number;

  @Expose()
  @ApiProperty({
    example: { pending: 5, confirmed: 10 },
    description: 'Số booking theo trạng thái',
    enum: BookingStatus,
  })
  statusCounts: Record<BookingStatus, number>;
}
