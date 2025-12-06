import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 6001,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'rootpassword',
        database: process.env.DB_NAME || 'badminton_hub',
        autoLoadEntities: true,
        synchronize: false,
        logging: process.env.DB_LOGGING === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}
