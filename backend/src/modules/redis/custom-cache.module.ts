import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { BusinessCacheRepository } from './business-cache.repository';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => {
                const redisUrl = process.env.REDIS_URL;
                return {
                    stores: [
                        // new Keyv({
                        //     store: new CacheableMemory({
                        //         ttl: 5 * 1000,
                        //     }),
                        // }),
                        new KeyvRedis(redisUrl),
                    ],
                    ttl: 5 * 1000,
                };
            },
        }),
    ],
    providers: [CacheService, BusinessCacheRepository],
    exports: [CacheService, BusinessCacheRepository],
})
export class CustomCacheModule {}
