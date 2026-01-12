import { Module } from '@nestjs/common';
import { OwnerSupperCourtModule } from './supper-court/owner-supper-court.module';
import { OwnerSubCourtModule } from './sub-court/owner-sub-court.module';
import { OwnerDashboardModule } from './dashboard/owner-dashboard.module';
import { LockCourtModule } from './lock-court/lock-court.module';

@Module({
  imports: [
    OwnerSupperCourtModule,
    OwnerSubCourtModule,
    OwnerDashboardModule,
    LockCourtModule,
  ],
})
export class OwnerModule {}
