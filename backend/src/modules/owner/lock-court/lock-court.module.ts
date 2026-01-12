import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { LockCourtController } from './lock-court.controller';
import { LockCourtService } from './lock-court.service';
import { BookingModule } from '../../booking/booking.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [BookingModule, TypeOrmModule.forFeature([SubCourtEntity]), JwtModule],
  controllers: [LockCourtController],
  providers: [LockCourtService],
})
export class LockCourtModule {}
