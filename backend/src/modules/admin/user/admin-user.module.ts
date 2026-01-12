import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../../../database/entities/booking.entity';
import { User } from '../../../database/entities/user.entity';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { JwtModule } from '@nestjs/jwt';
import { SendEmailModule } from '@/modules/send-email/sendEmail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, BookingEntity]), JwtModule, SendEmailModule],
  controllers: [AdminUserController],
  providers: [AdminUserService],
})
export class AdminUserModule {}
