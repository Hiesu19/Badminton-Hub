import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { OwnerSubCourtController } from './owner-sub-court.controller';
import { OwnerSubCourtService } from './owner-sub-court.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([SubCourtEntity, SupperCourtEntity]), JwtModule],
  controllers: [OwnerSubCourtController],
  providers: [OwnerSubCourtService],
})
export class OwnerSubCourtModule {}
