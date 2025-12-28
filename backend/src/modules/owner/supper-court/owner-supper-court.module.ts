import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { SupperCourtPriceEntity } from '../../../database/entities/price-court.entity';
import { OwnerSupperCourtController } from './owner-supper-court.controller';
import { OwnerSupperCourtService } from './owner-supper-court.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupperCourtEntity, SupperCourtPriceEntity]),
    JwtModule,
  ],
  controllers: [OwnerSupperCourtController],
  providers: [OwnerSupperCourtService],
})
export class OwnerSupperCourtModule {}
