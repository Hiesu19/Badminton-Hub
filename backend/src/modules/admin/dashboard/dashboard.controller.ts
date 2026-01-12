import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { DashboardService } from './dashboard.service';
import { CourtStatsResponseDto } from './dto/court-stats-response.dto';
import { UserStatsResponseDto } from './dto/user-stats-response.dto';
import { RevenueStatsResponseDto } from './dto/revenue-stats-response.dto';
import { HttpRes } from '@/shared/decorators/http-response.decorator';

@Controller('/admin/dashboard')
@ApiTags('Admin - Dashboard')
@AdminAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('courts')
  @CustomResponse(CourtStatsResponseDto, {
    message: 'Lấy số liệu sân',
    description: '[admin] Tổng số sân và số sân đang chờ duyệt',
    isPagination: false,
  })
  async courts() {
    return this.dashboardService.getCourtStats();
  }

  @Get('users')
  @CustomResponse(UserStatsResponseDto, {
    message: 'Lấy số lượng người dùng',
    description: '[admin] Tổng số tài khoản role USER',
  })
  async users() {
    return this.dashboardService.getUserStats();
  }

  @Get('revenue')
  @CustomResponse(RevenueStatsResponseDto, {
    message: 'Lấy số liệu doanh thu',
    description: '[admin] Tổng doanh thu trong ngày, tuần và tháng hiện tại',
  })
  async revenue() {
    return this.dashboardService.getRevenueStats();
  }
}
