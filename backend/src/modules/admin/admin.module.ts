import { Module } from '@nestjs/common';
import { SupperCourtModule } from './supper-court/supper-court.module';
import { AdminUserModule } from './user/admin-user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [DashboardModule, SupperCourtModule, AdminUserModule, ImagesModule],
})
export class AdminModule {}
