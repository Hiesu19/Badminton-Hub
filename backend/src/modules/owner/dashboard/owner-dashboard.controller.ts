import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OwnerAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { OwnerDashboardService } from './owner-dashboard.service';
import { OwnerCoverageResponseDto } from './dto/owner-coverage-response.dto';
import { OwnerDashboardResponseDto } from './dto/owner-dashboard-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('/owner/dashboard')
@ApiTags('Owner - Dashboard')
@OwnerAuth()
export class OwnerDashboardController {
  constructor(private readonly dashboardService: OwnerDashboardService) {}

  @Get()
  @CustomResponse(OwnerDashboardResponseDto, {
    code: 200,
    message: 'Lấy số liệu dashboard owner thành công',
    description: '[owner] Thống kê booking và doanh thu theo ngày/tuần/tháng',
  })
  async getDashboard(@Req() req: any) {
    const data = await this.dashboardService.getDashboard(req.user.id);
    return plainToInstance(OwnerDashboardResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Get('coverage')
  @CustomResponse(OwnerCoverageResponseDto, {
    code: 200,
    message: 'Tính độ phủ giờ đã được đặt',
    description:
      '[owner] Phần trăm thời gian đã đặt trong ngày cụ thể so với tổng giờ khả dụng',
  })
  async getDailyCoverage(@Req() req: any, @Query('date') date?: string) {
    const data = await this.dashboardService.getDailyCoverage(
      req.user.id,
      date,
    );
    return plainToInstance(OwnerCoverageResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
