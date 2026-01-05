import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { SupperCourtService } from './supper-court.service';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { PublicSupperCourtResponseDto } from './dto/public-supper-court-response.dto';
import { PublicSupperCourtPaginationDto } from './dto/public-supper-court-pagination.dto';
import { PublicSupperCourtBookingMatrixResponseDto } from './dto/public-supper-court-calendar.dto';
import { PublicSupperCourtPriceMatrixSlotDto } from './dto/public-supper-court-price-matrix.dto';
import { PublicSubCourtResponseDto } from './dto/public-sub-court-response.dto';

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

  @Get(':id/calendar/:date')
  @CustomResponse(PublicSupperCourtBookingMatrixResponseDto, {
    code: 200,
    message: 'Lấy lịch sân theo ngày thành công',
    description: '[public] Lịch booking của sân theo ngày',
  })
  async getCalendarPublic(
    @Param('id') id: string,
    @Param('date') date: string,
  ) {
    return this.supperCourtService.getCalendar(id, date, true);
  }

  @Get(':id/price-matrix')
  @CustomResponse('string', {
    code: 200,
    message: 'Ma trận giá thành công',
    description: '[public] Ma trận 7x48 slot mỗi ngày',
  })
  @ApiOperation({
    summary: 'Ma trận giá trong tuần',
  })
  @ApiExtraModels(PublicSupperCourtPriceMatrixSlotDto)
  @ApiResponse({
    status: 200,
    description: '7 đối tượng, mỗi đối tượng 48 slot 30 phút',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: { $ref: getSchemaPath(PublicSupperCourtPriceMatrixSlotDto) },
      },
    },
  })
  async priceMatrix(@Param('id') id: string) {
    return this.supperCourtService.getPriceMatrix(id);
  }

  @Get(':id/sub-courts')
  @CustomResponse(PublicSubCourtResponseDto, {
    code: 200,
    message: 'Lấy danh sách sân con thành công',
    description: '[public] Danh sách sân con theo cụm sân',
  })
  async listSubCourts(@Param('id') id: string) {
    return this.supperCourtService.getSubCourtsPublic(id);
  }
}
