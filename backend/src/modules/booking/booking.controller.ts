import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import {
  ListBookingQueryDto,
  ListBookingResponseDto,
} from './dto/list-booking-query.dto';
import { BookingDetailResponseDto } from './dto/booking-detail-response.dto';

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
  @CustomResponse(BookingDetailResponseDto, {
    message: 'Chi tiết booking của user',
    description: '[user] Lấy thông tin chi tiết booking của mình',
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
  // @CustomResponse([ListBookingResponseDto], {
  //   message: 'Danh sách booking trong supper court của owner',
  //   description: '[owner] Danh sách booking (có thể lọc theo ngày)',
  // })
  async listOwnerBookings(
    @Req() req: Request & { user?: any },
    @Query() query: ListBookingQueryDto,
  ) {
    const data = await this.bookingService.listByOwner(req.user.id, query.date);
    console.log(data);
    return data;
  }

  @Get('owner/:bookingId')
  @OwnerAuth()
  @CustomResponse(BookingDetailResponseDto, {
    message: 'Chi tiết booking',
    description: '[owner] Lấy thông tin chi tiết booking trong sân của mình',
  })
  async getOwnerBooking(
    @Req() req: Request & { user?: any },
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.findOneForOwner(req.user.id, bookingId);
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
  @CustomResponse([ListBookingResponseDto], {
    message: 'Danh sách booking toàn hệ thống',
    description: '[admin] Danh sách booking (có thể lọc theo ngày)',
  })
  async listAdminBookings(@Query() query: ListBookingQueryDto) {
    return this.bookingService.listAllForAdmin(query.date);
  }

  @Get('admin/:bookingId')
  @AdminAuth()
  @CustomResponse(BookingDetailResponseDto, {
    message: 'Chi tiết booking',
    description: '[admin] Lấy thông tin chi tiết booking',
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
