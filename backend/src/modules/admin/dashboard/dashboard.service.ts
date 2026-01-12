import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { BookingEntity } from '../../../database/entities/booking.entity';
import { User } from '../../../database/entities/user.entity';
import { BookingStatus } from 'src/shared/enums/booking.enum';
import { SupperCourtStatus } from 'src/shared/enums/supper-court.enum';
import { UserRole } from 'src/shared/enums/user.enum';
import { CourtStatsResponseDto } from './dto/court-stats-response.dto';
import { UserStatsResponseDto } from './dto/user-stats-response.dto';
import { RevenueStatsResponseDto } from './dto/revenue-stats-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SupperCourtEntity)
    private readonly courtRepository: Repository<SupperCourtEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async getCourtStats(): Promise<CourtStatsResponseDto> {
    const [totalCourts, pendingCourts] = await Promise.all([
      this.courtRepository.count(),
      this.courtRepository.count({
        where: { status: SupperCourtStatus.VERIFYING },
      }),
    ]);
    return plainToInstance(
      CourtStatsResponseDto,
      { totalCourts, pendingCourts },
      { excludeExtraneousValues: true },
    );
  }

  async getUserStats(): Promise<UserStatsResponseDto> {
    const totalUsers = await this.userRepository.count({
      where: { role: UserRole.USER },
    });

    return plainToInstance(
      UserStatsResponseDto,
      { totalUsers },
      { excludeExtraneousValues: true },
    );
  }

  async getRevenueStats(): Promise<RevenueStatsResponseDto> {
    const now = new Date();
    const [todayStart, todayEnd] = this.getDayRange(now);
    const [weekStart, weekEnd] = this.getWeekRange(now);
    const [monthStart, monthEnd] = this.getMonthRange(now);

    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      this.sumRevenueBetween(todayStart, todayEnd),
      this.sumRevenueBetween(weekStart, weekEnd),
      this.sumRevenueBetween(monthStart, monthEnd),
    ]);

    return plainToInstance(
      RevenueStatsResponseDto,
      {
        today: todayRevenue,
        week: weekRevenue,
        month: monthRevenue,
      },
      { excludeExtraneousValues: true },
    );
  }

  private async sumRevenueBetween(start: Date, end: Date): Promise<number> {
    const result = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('COALESCE(SUM(booking.totalPrice), 0)', 'total')
      .where('booking.status = :status', {
        status: BookingStatus.CONFIRMED,
      })
      .andWhere('booking.createdAt >= :start AND booking.createdAt < :end', {
        start,
        end,
      })
      .getRawOne();

    return Number(result?.total ?? 0);
  }

  private getDayRange(date: Date): [Date, Date] {
    const start = this.getStartOfDay(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return [start, end];
  }

  private getWeekRange(date: Date): [Date, Date] {
    const start = this.getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return [start, end];
  }

  private getMonthRange(date: Date): [Date, Date] {
    const start = this.getStartOfMonth(date);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return [start, end];
  }

  private getStartOfDay(date: Date): Date {
    const clone = new Date(date);
    clone.setHours(0, 0, 0, 0);
    return clone;
  }

  private getStartOfWeek(date: Date): Date {
    const clone = this.getStartOfDay(date);
    const offset = (clone.getDay() + 6) % 7;
    clone.setDate(clone.getDate() - offset);
    return clone;
  }

  private getStartOfMonth(date: Date): Date {
    const clone = this.getStartOfDay(date);
    clone.setDate(1);
    return clone;
  }
}
