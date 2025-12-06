import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';

@Injectable()
export class BusinessCacheRepository {
    private readonly OTP_EXPIRATION = 10 * 60;
    private readonly OTP_COUNTDOWN_EXPIRATION = 1 * 60;

    constructor(private readonly cacheService: CacheService) {}

    async getRegisterData(email: string) {
        return await this.cacheService.get(`registerData:${email}`);
    }

    async getOtpCountdown(email: string) {
        const ttl = await this.cacheService.ttl(`otp_countdown:${email}`);
        return ttl;
    }

    async saveOtp(email: string, otp: string) {
        await this.cacheService.set(
            `otp:${email}`,
            otp,
            this.OTP_EXPIRATION * 1000,
        );
        const unixNow = Math.floor(Date.now() / 1000);
        await this.cacheService.set(
            `otp_countdown:${email}`,
            unixNow + this.OTP_COUNTDOWN_EXPIRATION,
            this.OTP_COUNTDOWN_EXPIRATION * 1000,
        );
    }

    async saveRegisterData(email: string, data: any) {
        await this.cacheService.set(
            `registerData:${email}`,
            JSON.stringify(data),
            this.OTP_EXPIRATION * 1000,
        );
    }

    async getOtp(email: string) {
        return await this.cacheService.get(`otp:${email}`);
    }

    async deleteOtpRegisterData(email: string) {
        await this.cacheService.del(`otp:${email}`);
        await this.cacheService.del(`otp_countdown:${email}`);
        await this.cacheService.del(`registerData:${email}`);
    }

    async cacheTokenVersion(userId: string, tokenVersion: number) {
        await this.cacheService.set(`tokenVersion:${userId}`, tokenVersion, 0);
        await this.cacheService.set(
            `user:${userId}:tokenVersion`,
            tokenVersion,
            0,
        );
    }

    async getTokenVersion(userId: string) {
        const newKey = await this.cacheService.get(
            `user:${userId}:tokenVersion`,
        );
        if (newKey !== null && newKey !== undefined) return newKey;
        return await this.cacheService.get(`tokenVersion:${userId}`);
    }

    async saveOtpForgotPassword(email: string, role: string, otp: string) {
        await this.cacheService.set(
            `otp_forgot_password:${email}:${role}`,
            otp,
            this.OTP_EXPIRATION * 1000,
        );
        const unixNow = Math.floor(Date.now() / 1000);
        await this.cacheService.set(
            `otp_countdown:${email}`,
            unixNow + this.OTP_COUNTDOWN_EXPIRATION,
            this.OTP_COUNTDOWN_EXPIRATION * 1000,
        );
    }

    async getOtpForgotPassword(email: string, role: string) {
        return await this.cacheService.get(
            `otp_forgot_password:${email}:${role}`,
        );
    }

    async deleteOtpForgotPassword(email: string, role: string) {
        await this.cacheService.del(`otp_forgot_password:${email}:${role}`);
        await this.cacheService.del(`otp_countdown:${email}`);
    }
}
