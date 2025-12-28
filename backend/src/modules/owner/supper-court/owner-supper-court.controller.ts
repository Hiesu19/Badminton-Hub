import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OwnerSupperCourtService } from './owner-supper-court.service';
import { OwnerAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { SupperCourtResponseDto } from 'src/modules/admin/supper-court/dto/supper-court-response.dto';
import { UpdateOwnerSupperCourtDto } from './dto/update-owner-supper-court.dto';
import { CreateOwnerPriceDto } from './dto/create-owner-price.dto';
import { UpdateOwnerPriceDto } from './dto/update-owner-price.dto';

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
    description: '[owner] Danh sách bảng giá của cụm sân',
  })
  async listPrices(@Req() req: any) {
    return this.ownerSupperCourtService.listPrices(req.user.id);
  }

  @Post('prices')
  @CustomResponse('string', {
    code: 201,
    message: 'Tạo bảng giá thành công',
    description: '[owner] Thêm mới cấu hình giá',
  })
  async createPrice(@Req() req: any, @Body() dto: CreateOwnerPriceDto) {
    return this.ownerSupperCourtService.createPrice(req.user.id, dto);
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

  @Post('prices/:priceId/delete')
  @CustomResponse('string', {
    code: 200,
    message: 'Xóa bảng giá thành công',
    description: '[owner] Xóa cấu hình giá',
  })
  async deletePrice(@Req() req: any, @Param('priceId') priceId: string) {
    return this.ownerSupperCourtService.deletePrice(req.user.id, priceId);
  }
}
