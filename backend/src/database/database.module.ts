import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 6001),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'rootpassword'),
        database: configService.get<string>('DB_NAME', 'badminton_hub'),
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}
