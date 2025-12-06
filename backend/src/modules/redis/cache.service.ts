import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async set(key: string, value: any, ttl?: number) {
        await this.cacheManager.set(key, value, ttl);
    }

    async get(key: string) {
        return (await this.cacheManager.get(key)) || null;
    }

    async del(key: string) {
        await this.cacheManager.del(key);
    }
    async ttl(key: string) {
        const expireAt = await this.cacheManager.get(key);
        if (!expireAt) {
            return -1;
        }
        const now = Math.floor(Date.now() / 1000);
        const ttl = (expireAt as number) - now;
        return ttl > 0 ? ttl : -1;
    }
}
