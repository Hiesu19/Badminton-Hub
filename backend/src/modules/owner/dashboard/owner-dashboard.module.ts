import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../../../database/entities/booking.entity';
import { BookingItemEntity } from '../../../database/entities/booking-item.entity';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { OwnerDashboardController } from './owner-dashboard.controller';
import { OwnerDashboardService } from './owner-dashboard.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      BookingItemEntity,
      SupperCourtEntity,
      SubCourtEntity,
    ]),
    JwtModule,
  ],
  controllers: [OwnerDashboardController],
  providers: [OwnerDashboardService],
})
export class OwnerDashboardModule {}
