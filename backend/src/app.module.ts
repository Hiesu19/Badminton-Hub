import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomCacheModule } from './modules/redis/custom-cache.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { UserModule } from './modules/user/user.module';
import { UploadModule } from './modules/s3/upload.module';
import { AdminModule } from './modules/admin/admin.module';
import { BookingModule } from './modules/booking/booking.module';
import { SupperCourtModule } from './modules/supper-court/supper-court.module';
import { OwnerModule } from './modules/owner/owner.module';
import { ReviewModule } from './modules/review/review.module';
import { SendMqttModule } from './modules/send-mqtt/sendMqtt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CustomCacheModule,
    AuthModule,
    UserModule,
    UploadModule,
    AdminModule,
    BookingModule,
    SupperCourtModule,
    OwnerModule,
    ReviewModule,
    SendMqttModule,
  ],
  controllers: [],
  providers: [ResponseInterceptor],
})
export class AppModule {}
