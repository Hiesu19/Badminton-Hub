import { Module } from '@nestjs/common';
import { OwnerSupperCourtModule } from './supper-court/owner-supper-court.module';
import { OwnerSubCourtModule } from './sub-court/owner-sub-court.module';

@Module({
  imports: [OwnerSupperCourtModule, OwnerSubCourtModule],
})
export class OwnerModule {}
