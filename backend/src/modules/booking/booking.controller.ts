import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UploadBookingBillDto } from './dto/upload-booking-bill.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import {
  AdminAuth,
  OwnerAuth,
  UserAuth,
} from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { BookingEntity } from '../../database/entities/booking.entity';
import { CreateBookingResponseDto } from './dto/create-booking-response.dto';

@Controller('bookings')
@ApiTags('Bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UserAuth()
  // @CustomResponse(CreateBookingResponseDto, {
  //   code: 201,
  //   message: 'Tạo booking thành công',
  //   description: '[user] Tạo lịch thuê sân mới',
  // })
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

  @Get('me')
  @UserAuth()
  @CustomResponse([BookingEntity], {
    message: 'Lấy danh sách booking của user',
  })
  async listMine(@Req() req: Request & { user?: any }) {
    return this.bookingService.listByUser(req.user.id);
  }

  @Get('me/:bookingId')
  @UserAuth()
  @CustomResponse(BookingEntity, {
    message: 'Chi tiết booking của user',
  })
  async getMyBooking(
    @Req() req: Request & { user?: any },
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.findOneForUser(req.user.id, bookingId);
  }

  @Patch('me/:bookingId/cancel')
  @UserAuth()
  @CustomResponse(BookingEntity, {
    message: 'Huỷ booking',
  })
  async cancelMyBooking(
    @Req() req: Request & { user?: any },
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.cancelByUser(req.user.id, bookingId);
  }

  @Get('owner')
  @OwnerAuth()
  @CustomResponse([BookingEntity], {
    message: 'Danh sách booking trong supper court của owner',
  })
  async listOwnerBookings(@Req() req: Request & { user?: any }) {
    return this.bookingService.listByOwner(req.user.id);
  }

  @Patch('owner/:bookingId/status')
  @OwnerAuth()
  @CustomResponse(BookingEntity, {
    message: 'Cập nhật trạng thái booking',
  })
  async updateStatusByOwner(
    @Req() req: Request & { user?: any },
    @Param('bookingId') bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingService.updateStatusByOwner(req.user.id, bookingId, dto);
  }

  @Get('admin')
  @AdminAuth()
  @CustomResponse([BookingEntity], {
    message: 'Danh sách booking toàn hệ thống',
  })
  async listAdminBookings() {
    return this.bookingService.listAllForAdmin();
  }

  @Get('admin/:bookingId')
  @AdminAuth()
  @CustomResponse(BookingEntity, {
    message: 'Chi tiết booking',
  })
  async getAdminBooking(@Param('bookingId') bookingId: string) {
    return this.bookingService.getById(bookingId);
  }

  @Delete('admin/:bookingId')
  @AdminAuth()
  @CustomResponse('string', {
    message: 'Xóa booking',
  })
  async deleteAdminBooking(@Param('bookingId') bookingId: string) {
    return this.bookingService.deleteForAdmin(bookingId);
  }
}
