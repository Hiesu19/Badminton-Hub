import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueName } from './queue.interface';

export type LightMessagePayload = {
  type: 'LIGHT_ON' | 'LIGHT_OFF';
  bookingId: string;
  supperCourtId: string;
  subCourtId: string;
  executeAt: string;
  meta: {
    source: string;
    createdAt: string;
    [key: string]: unknown;
  };
  deviceKey?: string;
};

@Injectable()
export class SendMqttService {
  private readonly logger = new Logger(SendMqttService.name);

  constructor(@InjectQueue(QueueName.LIGHT) private readonly queue: Queue) {}

  private getDelay(executeAt: string | Date): number {
    const target = executeAt instanceof Date ? executeAt : new Date(executeAt);
    return Math.max(0, target.getTime() - Date.now());
  }

  private buildJobId(payload: LightMessagePayload) {
    return `booking-${payload.bookingId.replace(/:/g, '-')}-${payload.subCourtId.replace(
      /:/g,
      '-',
    )}-${payload.type}`;
  }

  async sendLightMessage(message: LightMessagePayload) {
    const delay = this.getDelay(message.executeAt);
    // const delay = 10000;
    const jobId = this.buildJobId(message);

    this.logger.log(`Schedule ${jobId} delay=${delay}ms`);

    await this.queue.add('light-message', message, {
      jobId,
      delay,
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
    });
  }

  async scheduleLightCycle(
    bookingId: string,
    supperCourtId: string,
    subCourtId: string,
    startTime: Date,
    endTime: Date,
    deviceKey?: string,
  ) {
    if (endTime <= startTime) {
      throw new Error('endTime must be after startTime');
    }

    const meta = {
      source: 'booking-service',
      createdAt: new Date().toISOString(),
    };

    await Promise.all([
      this.sendLightMessage({
        type: 'LIGHT_ON',
        bookingId,
        supperCourtId,
        subCourtId,
        executeAt: startTime.toISOString(),
        meta,
        deviceKey,
      }),
      this.sendLightMessage({
        type: 'LIGHT_OFF',
        bookingId,
        supperCourtId,
        subCourtId,
        executeAt: endTime.toISOString(),
        meta,
        deviceKey,
      }),
    ]);
  }

  async cancelLightCycle(bookingId: string, subCourtId: string) {
    const sanitize = (value: string) => value.replace(/:/g, '-');
    const onId = `booking-${sanitize(bookingId)}-${sanitize(subCourtId)}-LIGHT_ON`;
    const offId = `booking-${sanitize(bookingId)}-${sanitize(subCourtId)}-LIGHT_OFF`;

    await Promise.all([this.queue.remove(onId), this.queue.remove(offId)]);

    this.logger.log(`Cancelled jobs: ${onId}, ${offId}`);
  }
}
