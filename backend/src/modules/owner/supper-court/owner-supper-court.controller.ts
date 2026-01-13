import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OwnerSupperCourtService } from './owner-supper-court.service';
import { OwnerAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { SupperCourtResponseDto } from 'src/modules/admin/supper-court/dto/supper-court-response.dto';
import { UpdateOwnerSupperCourtDto } from './dto/update-owner-supper-court.dto';
import { UpdateOwnerPriceDto } from './dto/update-owner-price.dto';
import { ListPricesQueryDto } from './dto/list-prices-query.dto';
import { CopyPricesDto } from './dto/copy-prices.dto';
import { UpdateOwnerBulkPriceDto } from './dto/update-owner-bulk-price.dto';
import { DeviceKeyResponseDto } from './dto/device-key-response.dto';

@Controller('/owner/supper-court')
@ApiTags('Owner - Supper Court')
@OwnerAuth()
export class OwnerSupperCourtController {
  constructor(
    private readonly ownerSupperCourtService: OwnerSupperCourtService,
  ) {}

  @Get('me')
  @CustomResponse(SupperCourtResponseDto, {
    code: 200,
    message: 'Lấy thông tin cụm sân thành công',
    description: '[owner] Thông tin cụm sân của tôi',
  })
  async getMySupperCourt(@Req() req: any) {
    return this.ownerSupperCourtService.getMySupperCourt(req.user.id);
  }

  @Patch('me')
  @CustomResponse(SupperCourtResponseDto, {
    code: 200,
    message: 'Cập nhật cụm sân thành công',
    description:
      '[owner] Cập nhật thông tin cụm sân (không được phép đổi địa chỉ)',
  })
  async updateMySupperCourt(
    @Req() req: any,
    @Body() dto: UpdateOwnerSupperCourtDto,
  ) {
    return this.ownerSupperCourtService.updateMySupperCourt(req.user.id, dto);
  }

  // ---------- Bảng giá ----------

  @Get('prices')
  @CustomResponse('string', {
    code: 200,
    message: 'Lấy danh sách bảng giá thành công',
    description:
      '[owner] Danh sách bảng giá của cụm sân (có thể lọc theo thứ trong tuần)',
  })
  async listPrices(@Req() req: any, @Query() query: ListPricesQueryDto) {
    return this.ownerSupperCourtService.listPrices(
      req.user.id,
      query.dayOfWeek,
    );
  }

  @Patch('prices/:priceId')
  @CustomResponse('string', {
    code: 200,
    message: 'Cập nhật bảng giá thành công',
    description: '[owner] Cập nhật cấu hình giá',
  })
  async updatePrice(
    @Req() req: any,
    @Param('priceId') priceId: string,
    @Body() dto: UpdateOwnerPriceDto,
  ) {
    return this.ownerSupperCourtService.updatePrice(req.user.id, priceId, dto);
  }

  @Post('prices/copy')
  @CustomResponse('string', {
    code: 200,
    message: 'Copy cấu hình giá thành công',
    description: '[owner] Copy cấu hình giá từ thứ này sang thứ khác',
  })
  async copyPrices(@Req() req: any, @Body() dto: CopyPricesDto) {
    return this.ownerSupperCourtService.copyPrices(
      req.user.id,
      dto.dayOfWeekFrom,
      dto.dayOfWeekTo,
    );
  }

  @Post('prices/bulk-update')
  @CustomResponse('string', {
    code: 200,
    message: 'Cập nhật giá theo dải thời gian thành công',
    description:
      '[owner] Áp dụng một mức giá cho tất cả các slot 30p trong khoảng thời gian chỉ định của một thứ',
  })
  async bulkUpdatePrices(
    @Req() req: any,
    @Body() dto: UpdateOwnerBulkPriceDto,
  ) {
    return this.ownerSupperCourtService.bulkUpdatePrices(
      req.user.id,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
      dto.pricePerHour,
    );
  }

  @Get('device-key')
  @CustomResponse(DeviceKeyResponseDto, {
    message: 'Lấy device key',
    description: '[owner] Lấy key thiết bị kết nối MQTT',
  })
  async getDeviceKey(@Req() req: any) {
    return this.ownerSupperCourtService.getDeviceKey(req.user.id);
  }

  @Patch('device-key')
  @CustomResponse(DeviceKeyResponseDto, {
    message: 'Tạo device key mới',
    description: '[owner] Sinh lại key thiết bị để dùng trong IOT',
  })
  async regenerateDeviceKey(@Req() req: any) {
    return this.ownerSupperCourtService.regenerateDeviceKey(req.user.id);
  }
}
