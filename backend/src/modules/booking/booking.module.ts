import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingEntity } from '../../database/entities/booking.entity';
import { BookingItemEntity } from '../../database/entities/booking-item.entity';
import { SubCourtEntity } from '../../database/entities/sub-court.entity';
import { UploadModule } from '../s3/upload.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      BookingItemEntity,
      SubCourtEntity,
    ]),
    UploadModule,
    JwtModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
