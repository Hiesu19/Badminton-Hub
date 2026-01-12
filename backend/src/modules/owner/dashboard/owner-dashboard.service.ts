import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../../../database/entities/booking.entity';
import { BookingItemEntity } from '../../../database/entities/booking-item.entity';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { BookingStatus } from '../../../shared/enums/booking.enum';

@Injectable()
export class OwnerDashboardService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(BookingItemEntity)
    private readonly bookingItemRepository: Repository<BookingItemEntity>,
    @InjectRepository(SupperCourtEntity)
    private readonly supperCourtRepository: Repository<SupperCourtEntity>,
    @InjectRepository(SubCourtEntity)
    private readonly subCourtRepository: Repository<SubCourtEntity>,
  ) {}

  async getDashboard(ownerId: string) {
    const numericId = Number(ownerId);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ownerId không hợp lệ');
    }

    const now = new Date();
    const startOfDay = this.startOfDay(now);
    const startOfWeek = this.startOfWeek(now);
    const startOfMonth = this.startOfMonth(now);
    const endOfPeriod = new Date(now);

    const [daily, weekly, monthly, total] = await Promise.all([
      this.countPeriod(numericId, startOfDay, endOfPeriod),
      this.countPeriod(numericId, startOfWeek, endOfPeriod),
      this.countPeriod(numericId, startOfMonth, endOfPeriod),
      this.countPeriod(numericId),
    ]);

    const statusCounts = await this.getStatusCounts(numericId);
    const uniqueCustomers = await this.countUniqueCustomers(numericId);
    const bookedCourtCount = await this.countDistinctCourts(numericId);

    return {
      dailyBookingCount: daily.count,
      weeklyBookingCount: weekly.count,
      monthlyBookingCount: monthly.count,
      dailyRevenue: daily.revenue,
      weeklyRevenue: weekly.revenue,
      monthlyRevenue: monthly.revenue,
      totalBookings: total.count,
      totalRevenue: total.revenue,
      uniqueCustomers,
      bookedCourtCount,
      statusCounts,
    };
  }

  async getDailyCoverage(ownerId: string, date?: string) {
    const numericId = Number(ownerId);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ownerId không hợp lệ');
    }

    const dayString = this.normalizeDate(date);
    const { bookedSeconds } = await this.sumBookedSeconds(numericId, dayString);
    const bookedHours = bookedSeconds / 3600;
    const subCourtCount = await this.countOwnedSubCourts(numericId);
    const availableHours = subCourtCount * 24;
    const percentage =
      availableHours > 0
        ? Number((bookedHours / availableHours).toFixed(4))
        : 0;

    return {
      date: dayString,
      bookedHours: Number(bookedHours.toFixed(3)),
      availableHours,
      percentage,
    };
  }

  private async countPeriod(
    ownerId: number,
    from?: Date,
    to?: Date,
  ): Promise<{ count: number; revenue: number }> {
    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .select('COUNT(booking.id)', 'count')
      .addSelect('COALESCE(SUM(booking.totalPrice), 0)', 'revenue')
      .innerJoin('booking.supperCourt', 'court')
      .where('court.user_id = :ownerId', { ownerId });

    if (from) {
      qb.andWhere('booking.createdAt >= :from', { from });
    }
    if (to) {
      qb.andWhere('booking.createdAt <= :to', { to });
    }

    const result = await qb.getRawOne();
    return {
      count: Number(result?.count ?? 0),
      revenue: Number(result?.revenue ?? 0),
    };
  }

  private async getStatusCounts(ownerId: number) {
    const rows = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('booking.status', 'status')
      .addSelect('COUNT(booking.id)', 'count')
      .innerJoin('booking.supperCourt', 'court')
      .where('court.user_id = :ownerId', { ownerId })
      .groupBy('booking.status')
      .getRawMany();

    const counts: Record<BookingStatus, number> = {
      [BookingStatus.PENDING]: 0,
      [BookingStatus.CONFIRMED]: 0,
      [BookingStatus.REJECTED]: 0,
      [BookingStatus.CANCELLED]: 0,
      [BookingStatus.LOCKED]: 0,
      [BookingStatus.OUT_OF_SYSTEM]: 0,
    };

    rows.forEach((row) => {
      const status = row.status as BookingStatus;
      counts[status] = Number(row.count ?? 0);
    });

    return counts;
  }

  private async countUniqueCustomers(ownerId: number) {
    const row = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('COUNT(DISTINCT booking.user_id)', 'count')
      .innerJoin('booking.supperCourt', 'court')
      .where('court.user_id = :ownerId', { ownerId })
      .getRawOne();

    return Number(row?.count ?? 0);
  }

  private async countDistinctCourts(ownerId: number) {
    const row = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('COUNT(DISTINCT booking.supper_court_id)', 'count')
      .innerJoin('booking.supperCourt', 'court')
      .where('court.user_id = :ownerId', { ownerId })
      .getRawOne();

    return Number(row?.count ?? 0);
  }

  private async countOwnedSubCourts(ownerId: number) {
    return await this.subCourtRepository
      .createQueryBuilder('subCourt')
      .select('COUNT(subCourt.id)', 'count')
      .innerJoin('subCourt.supperCourt', 'court')
      .where('court.user_id = :ownerId', { ownerId })
      .getRawOne()
      .then((row) => Number(row?.count ?? 0));
  }

  private async sumBookedSeconds(ownerId: number, date: string) {
    const row = await this.bookingItemRepository
      .createQueryBuilder('item')
      .select(
        'COALESCE(SUM(TIMESTAMPDIFF(SECOND, item.start_time, item.end_time)), 0)',
        'bookedSeconds',
      )
      .innerJoin('item.booking', 'booking')
      .innerJoin('booking.supperCourt', 'court')
      .where('court.user_id = :ownerId', { ownerId })
      .andWhere('item.date = :date', { date })
      .getRawOne();

    return {
      bookedSeconds: Number(row?.bookedSeconds ?? 0),
    };
  }

  private normalizeDate(date?: string) {
    if (date) {
      const parsed = new Date(date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
    }
    return new Date().toISOString().slice(0, 10);
  }

  private startOfDay(date: Date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  private startOfWeek(date: Date) {
    const copy = this.startOfDay(date);
    const day = copy.getDay();
    const diff = (day + 6) % 7;
    copy.setDate(copy.getDate() - diff);
    return copy;
  }

  private startOfMonth(date: Date) {
    const copy = this.startOfDay(date);
    copy.setDate(1);
    return copy;
  }
}
