import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomCacheModule } from './modules/redis/custom-cache.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { UserModule } from './modules/user/user.module';
import { UploadModule } from './modules/s3/upload.module';
import { AdminModule } from './modules/admin/admin.module';

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
  ],
  controllers: [],
  providers: [ResponseInterceptor],
})
export class AppModule {}
