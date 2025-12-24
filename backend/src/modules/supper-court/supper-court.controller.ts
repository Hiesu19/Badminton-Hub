import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupperCourtService } from './supper-court.service';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { PublicSupperCourtResponseDto } from './dto/public-supper-court-response.dto';
import { PublicSupperCourtPaginationDto } from './dto/public-supper-court-pagination.dto';

@Controller('/public/supper-courts')
@ApiTags('Public - Supper Courts')
export class SupperCourtController {
  constructor(private readonly supperCourtService: SupperCourtService) {}

  @Get()
  @CustomResponse(PublicSupperCourtResponseDto, {
    code: 200,
    message: 'Lấy danh sách sân thành công',
    description: '[public] Danh sách sân (phân trang)',
    isPagination: true,
  })
  async listPublic(@Query() query: PublicSupperCourtPaginationDto) {
    return this.supperCourtService.findAllPublic(query);
  }

  @Get(':id')
  @CustomResponse(PublicSupperCourtResponseDto, {
    code: 200,
    message: 'Lấy chi tiết sân thành công',
    description: '[public] Chi tiết sân theo id',
  })
  async detailPublic(@Param('id') id: string) {
    return this.supperCourtService.findOnePublic(id);
  }
}
