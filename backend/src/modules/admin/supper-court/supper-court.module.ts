import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { SupperCourtPriceEntity } from '../../../database/entities/price-court.entity';
import { ImageEntity } from '../../../database/entities/court-image.entity';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { BookingEntity } from '../../../database/entities/booking.entity';
import { SupperCourtController } from './supper-court.controller';
import { SupperCourtService } from './supper-court.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupperCourtEntity,
      SupperCourtPriceEntity,
      ImageEntity,
      SubCourtEntity,
      BookingEntity,
    ]),
    JwtModule,
  ],
  controllers: [SupperCourtController],
  providers: [SupperCourtService],
})
export class SupperCourtModule {}
