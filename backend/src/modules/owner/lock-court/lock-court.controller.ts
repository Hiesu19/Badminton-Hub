import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OwnerAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { CreateBookingDto } from '../../booking/dto/create-booking.dto';
import { CreateBookingResponseDto } from '../../booking/dto/create-booking-response.dto';
import { LockCourtService } from './lock-court.service';

@Controller('/owner/lock-court')
@ApiTags('Owner - Lock Court')
@OwnerAuth()
export class LockCourtController {
  constructor(private readonly lockCourtService: LockCourtService) {}

  @Post()
  @CustomResponse(CreateBookingResponseDto, {
    code: 201,
    message: 'Tạo booking lock-court thành công',
    description:
      '[owner] Tạo booking OUT_OF_SYSTEM cho khách hàng liên hệ trực tiếp',
  })
  async lockCourt(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.lockCourtService.lockCourt(req.user.id, dto);
  }
}
