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
import {
  AdminAuth,
  AllAuth,
  OwnerAuth,
} from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { SupperCourtService } from './supper-court.service';
import { CreateSupperCourtDto } from './dto/create-supper-court.dto';
import { UpdateSupperCourtDto } from './dto/update-supper-court.dto';
import { SupperCourtResponseDto } from './dto/supper-court-response.dto';
import { SupperCourtDetailResponseDto } from './dto/supper-court-detail-response.dto';
import { SupperCourtPaginationDto } from './dto/pagination-supper-court.dto';

@Controller('/supper-courts')
@ApiTags('Supper Courts')
export class SupperCourtController {
  constructor(private readonly supperCourtService: SupperCourtService) {}

  @Post()
  @OwnerAuth()
  @CustomResponse(SupperCourtResponseDto, {
    code: 201,
    message: 'Tạo sân thành công',
    description: '[owner] Tạo sân cầu lông mới (yêu cầu chủ sân)',
  })
  async create(@Req() req: any, @Body() dto: CreateSupperCourtDto) {
    return this.supperCourtService.create(req.user.id, dto);
  }

  @Get()
  @AdminAuth()
  @CustomResponse(SupperCourtResponseDto, {
    code: 200,
    message: 'Lấy danh sách sân thành công',
    description: '[admin] Danh sách sân (phân trang, lọc theo status)',
    isPagination: true,
  })
  async findAll(@Query() query: SupperCourtPaginationDto) {
    return this.supperCourtService.findAll(query);
  }

  @Get(':id')
  @AdminAuth()
  @CustomResponse(SupperCourtDetailResponseDto, {
    code: 200,
    message: 'Lấy chi tiết sân thành công',
    description:
      '[admin] Lấy chi tiết sân theo id, bao gồm ảnh, owner, booking count',
  })
  async findOne(@Param('id') id: string) {
    return this.supperCourtService.findOne(id);
  }

  @Patch(':id')
  @AdminAuth()
  @CustomResponse(SupperCourtResponseDto, {
    code: 200,
    message: 'Cập nhật sân / trạng thái sân thành công',
    description: '[admin] Cập nhật thông tin / phê duyệt sân',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateSupperCourtDto) {
    return this.supperCourtService.update(id, dto);
  }

  @Delete(':id')
  @AdminAuth()
  @CustomResponse('string', {
    code: 200,
    message: 'Xóa sân thành công',
    description: '[admin] Xóa sân theo id',
  })
  async remove(@Param('id') id: string) {
    return this.supperCourtService.remove(id);
  }
}
