import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { BookingEntity } from '../../../database/entities/booking.entity';
import { User } from '../../../database/entities/user.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([
      SupperCourtEntity,
      BookingEntity,
      User,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

