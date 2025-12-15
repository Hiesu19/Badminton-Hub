import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QueueName } from './queue.interface';
import { Queue } from 'bullmq';
import {
    genHtmlForgotPasswordStore,
    genHtmlRegisterOtp,
    genHtmlStoreAccount,
    genHtmlStoreAccountReject,
    genHtmlVerifyForgotEmail,
} from 'src/modules/send-email/genHTML.util';

@Injectable()
export class SendEmailService {
    constructor(
        @InjectQueue(QueueName.SEND_EMAIL) private sendEmailQueue: Queue,
    ) {}

    async sendMailRegisterOtp(
        to: string,
        subject: string,
        otp: string,
        mode: string = 'prod',
    ) {
        if (mode === 'dev') {
            to = 'thaihieu1929@gmail.com';
        }
        const html = genHtmlRegisterOtp(otp);
        await this.sendEmailQueue.add(
            'send-email',
            { to, subject, html },
            {
                removeOnComplete: true,
                attempts: 4,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            },
        );
    }

    async sendMailForgotPasswordOtp(
        to: string,
        subject: string,
        otp: string,
        mode: string = 'prod',
    ) {
        let a = to;
        if (mode === 'dev') {
            to = 'thaihieu1929@gmail.com';
        }
        const html = genHtmlVerifyForgotEmail(a, otp);
        await this.sendEmailQueue.add(
            'send-email',
            { to, subject, html },
            {
                removeOnComplete: true,
                attempts: 4,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            },
        );
    }

    async sendMailStoreAccount(
        to: string,
        subject: string,
        data: any,
        mode: string = 'prod',
    ) {
        if (mode === 'dev') {
            to = 'thaihieu1929@gmail.com';
        }
        const html = genHtmlStoreAccount(
            data.fullName,
            data.username,
            data.password,
        );
        await this.sendEmailQueue.add(
            'send-email',
            { to, subject, html },
            {
                removeOnComplete: true,
                attempts: 4,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            },
        );
    }

    async sendMailStoreAccountReject(
        to: string,
        subject: string,
        data: any,
        mode: string = 'prod',
    ) {
        if (mode === 'dev') {
            to = 'thaihieu1929@gmail.com';
        }
        const html = genHtmlStoreAccountReject(data.fullName);
        await this.sendEmailQueue.add(
            'send-email',
            { to, subject, html },
            {
                removeOnComplete: true,
                attempts: 4,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            },
        );
    }

    async sendMailForgotPasswordStore(
        to: string,
        subject: string,
        data: any,
        mode: string = 'prod',
    ) {
        if (mode === 'dev') {
            to = 'thaihieu1929@gmail.com';
        }
        const html = genHtmlForgotPasswordStore(
            data.storename,
            data.password,
            data.email,
        );
        await this.sendEmailQueue.add(
            'send-email',
            { to, subject, html },
            {
                removeOnComplete: true,
                attempts: 4,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            },
        );
    }
}
