import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { QueueName } from './queue.interface';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';
import { LightMessagePayload } from './sendMqtt.service';

type MqttPayload = {
  zone: number | null;
  cmd: 'ON' | 'OFF';
  bookingId: string;
};

@Processor(QueueName.LIGHT)
@Injectable()
export class SendMqttProcessor extends WorkerHost implements OnModuleDestroy {
  private readonly logger = new Logger(SendMqttProcessor.name);
  private readonly client: MqttClient;

  constructor(private readonly configService: ConfigService) {
    super();

    const mqttUrl =
      this.configService.get<string>('MQTT_URL') ?? 'mqtt://localhost:1883';

    this.client = connect(mqttUrl, {
      username: this.configService.get<string>('MQTT_USER'),
      password: this.configService.get<string>('MQTT_PASSWORD'),
      reconnectPeriod: 2000,
    });

    this.client.on('connect', () => {
      this.logger.log('MQTT connected');
    });

    this.client.on('error', (err) => {
      this.logger.error('MQTT error', err);
    });
  }

  async process(job: Job<LightMessagePayload>) {
    const { supperCourtId, subCourtId, type, bookingId } = job.data;

    const deviceKey = job.data.deviceKey?.trim() || 'default';
    const topic = `field/${supperCourtId}/${deviceKey}/light`;

    const payload: MqttPayload = {
      zone: this.extractZone(subCourtId),
      cmd: type === 'LIGHT_ON' ? 'ON' : 'OFF',
      bookingId,
    };

    this.logger.log(
      `MQTT → ${topic} | ${payload.cmd} | booking=${bookingId} | zone=${payload.zone}`,
    );

    await this.publish(topic, JSON.stringify(payload));
  }

  private extractZone(subCourtId: string): number | null {
    const match = subCourtId.match(/\d+/);
    if (!match) return null;
    const zone = Number(match[0]);
    return Number.isNaN(zone) ? null : zone;
  }

  private publish(topic: string, message: string) {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(topic, message, { qos: 1 }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  onModuleDestroy() {
    this.client?.end(true);
  }
}
