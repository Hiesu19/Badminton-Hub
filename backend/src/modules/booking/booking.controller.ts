import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UploadBookingBillDto } from './dto/upload-booking-bill.dto';
import { UserAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { BookingEntity } from '../../database/entities/booking.entity';

@Controller('bookings')
@ApiTags('Bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UserAuth()
  @CustomResponse(BookingEntity, {
    code: 201,
    message: 'Tạo booking thành công',
    description: '[user] Tạo lịch thuê sân mới',
  })
  async createBooking(
    @Req() req: Request & { user?: any },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(req.user.id, dto);
  }

  @Post(':bookingId/bill')
  @UserAuth()
  @CustomResponse(BookingEntity, {
    message: 'Đính kèm bill thành công',
    description: '[user] Gửi ảnh bill để chủ sân xác nhận',
  })
  async uploadBill(
    @Req() req: Request & { user?: any },
    @Param('bookingId') bookingId: string,
    @Body() dto: UploadBookingBillDto,
  ) {
    return this.bookingService.uploadBill(req.user.id, bookingId, dto);
  }
}

