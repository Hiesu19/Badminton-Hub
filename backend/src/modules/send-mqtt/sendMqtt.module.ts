import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueName } from './queue.interface';
import { SendMqttService } from './sendMqtt.service';
import { SendMqttProcessor } from './sendMqtt.processor';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6002),
        },
      }),
    }),
    BullModule.registerQueue({
      name: QueueName.LIGHT,
    }),
  ],
  providers: [SendMqttService, SendMqttProcessor],
  exports: [SendMqttService],
})
export class SendMqttModule {}
