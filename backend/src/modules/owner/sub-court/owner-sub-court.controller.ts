import { Body, Controller, Get, Param, Post, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OwnerSubCourtService } from './owner-sub-court.service';
import { OwnerAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { CreateOwnerSubCourtDto } from './dto/create-owner-sub-court.dto';
import { ToggleOwnerLightDto } from './dto/toggle-owner-light.dto';
import { UpdateOwnerSubCourtDto } from './dto/update-owner-sub-court.dto';

@Controller('/owner/sub-courts')
@ApiTags('Owner - Sub Courts')
@OwnerAuth()
export class OwnerSubCourtController {
  constructor(private readonly ownerSubCourtService: OwnerSubCourtService) {}

  @Get()
  @CustomResponse('string', {
    code: 200,
    message: 'Lấy danh sách sân con thành công',
    description: '[owner] Danh sách sân con thuộc cụm sân của tôi',
  })
  async listSubCourts(@Req() req: any) {
    return this.ownerSubCourtService.listSubCourts(req.user.id);
  }

  @Post()
  @CustomResponse('string', {
    code: 201,
    message: 'Tạo sân con thành công',
    description: '[owner] Thêm sân con mới',
  })
  async createSubCourt(@Req() req: any, @Body() dto: CreateOwnerSubCourtDto) {
    return this.ownerSubCourtService.createSubCourt(req.user.id, dto);
  }

  @Patch(':id')
  @CustomResponse('string', {
    code: 200,
    message: 'Cập nhật sân con thành công',
    description: '[owner] Cập nhật thông tin sân con',
  })
  async updateSubCourt(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOwnerSubCourtDto,
  ) {
    return this.ownerSubCourtService.updateSubCourt(req.user.id, id, dto);
  }

  @Post(':id/delete')
  @CustomResponse('string', {
    code: 200,
    message: 'Xóa sân con thành công',
    description: '[owner] Xóa sân con',
  })
  async deleteSubCourt(@Req() req: any, @Param('id') id: string) {
    return this.ownerSubCourtService.deleteSubCourt(req.user.id, id);
  }

  @Post(':id/light')
  @CustomResponse('string', {
    code: 200,
    message: 'Gửi tín hiệu đèn thành công',
    description: '[owner] Bật/tắt đèn sân con ngay lập tức',
  })
  async toggleLight(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ToggleOwnerLightDto,
  ) {
    return this.ownerSubCourtService.toggleSubCourtLight(req.user.id, id, dto);
  }
}
