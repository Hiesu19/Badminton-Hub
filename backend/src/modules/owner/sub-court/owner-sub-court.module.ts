import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { OwnerSubCourtController } from './owner-sub-court.controller';
import { OwnerSubCourtService } from './owner-sub-court.service';
import { JwtModule } from '@nestjs/jwt';
import { SendMqttModule } from '../../send-mqtt/sendMqtt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCourtEntity, SupperCourtEntity]),
    JwtModule,
    SendMqttModule,
  ],
  controllers: [OwnerSubCourtController],
  providers: [OwnerSubCourtService],
})
export class OwnerSubCourtModule {}
