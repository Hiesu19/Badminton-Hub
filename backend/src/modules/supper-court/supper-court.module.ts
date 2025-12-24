import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupperCourtEntity } from '../../database/entities/supper-court.entity';
import { SupperCourtController } from './supper-court.controller';
import { SupperCourtService } from './supper-court.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupperCourtEntity])],
  controllers: [SupperCourtController],
  providers: [SupperCourtService],
})
export class SupperCourtModule {}
