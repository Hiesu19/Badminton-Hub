import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName } from './queue.interface';
import { SendEmailService } from './sendEmail.service';
import { SendEmailConsumer } from './sendEmail.consumer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6002),
        },
      }),
    }),
    BullModule.registerQueue({
      name: QueueName.SEND_EMAIL,
    }),
    BullModule.registerQueue({
      name: QueueName.DEATH_SEND_EMAIL,
    }),
  ],
  providers: [SendEmailService, SendEmailConsumer],
  exports: [SendEmailService],
})
export class SendEmailModule {}
