import {
    InjectQueue,
    OnWorkerEvent,
    Processor,
    WorkerHost,
} from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import nodemailer, { Transporter } from 'nodemailer';
import { QueueName } from './queue.interface';
import { ConfigService } from '@nestjs/config';

@Processor(QueueName.SEND_EMAIL)
export class SendEmailConsumer extends WorkerHost {
    private readonly transporter: Transporter;
    private readonly transporter2: Transporter;

    constructor(
        @InjectQueue(QueueName.DEATH_SEND_EMAIL) private deathQueue: Queue,
        private readonly configService: ConfigService,
    ) {
        super();

        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT', 465),
            secure: true,
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });

        this.transporter2 = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('EMAIL2_USER'),
                pass: this.configService.get<string>('EMAIL2_PASSWORD'),
            },
        });
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { to, subject, html } = job.data;

        const mailServer =
            job.attemptsMade < 2 ? this.transporter : this.transporter2;

        try {
            await mailServer.sendMail({
                from: `${this.configService.get<string>('EMAIL_FROM')} <${this.configService.get<string>('EMAIL_USER')}>`,
                to,
                subject,
                html,
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job, error: Error) {
        if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
            const faild = {
                to: job.data.to,
                html: job.data.html,
                subject: job.data.subject,
                error: error.message,
                failedTimestamp: new Date().toISOString(),
            };

            await this.deathQueue.add('failed-email', faild, {
                removeOnComplete: true,
            });
        }
    }
}
