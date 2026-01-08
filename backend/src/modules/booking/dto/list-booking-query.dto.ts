import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

export class ListBookingQueryDto {
  @ApiPropertyOptional({
    example: '2026-01-15',
    description:
      'Lọc theo ngày đặt sân (YYYY-MM-DD). Không truyền = lấy tất cả',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}

// Nested DTOs
@Exclude()
export class BookingUserResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'Id người dùng' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Nguyen Hieu', description: 'Tên người dùng' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'thaihieu1@gmail.com', description: 'Email' })
  email: string;

  @Expose()
  @ApiProperty({ example: '+84898610991', description: 'Số điện thoại' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'user', description: 'Vai trò' })
  role: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Trạng thái hoạt động' })
  isActive: boolean;

  @Expose()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL avatar',
  })
  avatarUrl: string;
}

@Exclude()
export class BookingSupperCourtResponseDto {
  @Expose()
  @ApiProperty({ example: '2', description: 'Id cụm sân' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Sân cầu lông HUST', description: 'Tên cụm sân' })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'Sân cầu lông chất lượng cao, 6 sân, có bãi gửi xe',
    description: 'Mô tả',
  })
  description: string;

  @Expose()
  @ApiProperty({ example: 'active', description: 'Trạng thái' })
  status: string;

  @Expose()
  @ApiProperty({
    example: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    description: 'Địa chỉ',
  })
  address: string;

  @Expose()
  @ApiProperty({
    example: 'https://maps.app.goo.gl/xxx',
    description: 'Link địa chỉ',
  })
  addressLink: string;

  @Expose()
  @ApiProperty({ example: '21.00456700', description: 'Vĩ độ' })
  latitude: string;

  @Expose()
  @ApiProperty({ example: '105.84312300', description: 'Kinh độ' })
  longitude: string;

  @Expose()
  @ApiProperty({ example: '0987654321', description: 'Số điện thoại' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'contact@sancau.com', description: 'Email' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'https://sancau.com', description: 'Website' })
  website: string;

  @Expose()
  @ApiProperty({ example: 'Vietcombank', description: 'Tên ngân hàng' })
  bankName: string;

  @Expose()
  @ApiProperty({ example: '0123456789', description: 'Số tài khoản' })
  bankAccountNumber: string;

  @Expose()
  @ApiProperty({
    example: 'https://qr.sepay.vn/img?bank=xxx',
    description: 'URL mã QR',
  })
  qrCodeUrl: string;

  @Expose()
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL ảnh đại diện',
  })
  imageUrl: string;
}

@Exclude()
export class BookingSubCourtResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'Id sân con' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Sân số 1', description: 'Tên sân con' })
  name: string;
}

@Exclude()
export class BookingItemResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'Id booking item' })
  id: number;

  @Expose()
  @ApiProperty({ example: '2026-01-15', description: 'Ngày đặt sân' })
  date: string;

  @Expose()
  @ApiProperty({ example: '08:00:00', description: 'Giờ bắt đầu' })
  startTime: string;

  @Expose()
  @ApiProperty({ example: '10:00:00', description: 'Giờ kết thúc' })
  endTime: string;

  @Expose()
  @ApiProperty({ example: 200000, description: 'Giá (VNĐ)' })
  price: number;

  @Expose()
  @Type(() => BookingSubCourtResponseDto)
  @ApiProperty({
    type: BookingSubCourtResponseDto,
    description: 'Thông tin sân con',
  })
  subCourt: BookingSubCourtResponseDto;
}

@Exclude()
export class ListBookingResponseDto {
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
