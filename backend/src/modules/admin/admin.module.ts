import { Module } from '@nestjs/common';
import { SupperCourtModule } from './supper-court/supper-court.module';
import { AdminUserModule } from './user/admin-user.module';

@Module({
  imports: [SupperCourtModule, AdminUserModule],
})
export class AdminModule {}
