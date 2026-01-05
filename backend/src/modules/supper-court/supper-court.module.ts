import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingItemEntity } from '../../database/entities/booking-item.entity';
import { SubCourtEntity } from '../../database/entities/sub-court.entity';
import { SupperCourtEntity } from '../../database/entities/supper-court.entity';
import { SupperCourtPriceEntity } from '../../database/entities/price-court.entity';
import { SupperCourtController } from './supper-court.controller';
import { SupperCourtService } from './supper-court.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupperCourtEntity,
      BookingItemEntity,
      SupperCourtPriceEntity,
      SubCourtEntity,
    ]),
  ],
  controllers: [SupperCourtController],
  providers: [SupperCourtService],
})
export class SupperCourtModule {}
