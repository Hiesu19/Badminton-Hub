import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { BusinessCacheRepository } from './business-cache.repository';
import KeyvRedis from '@keyv/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        ConfigModule,
        CacheModule.registerAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const explicitUrl = configService.get<string>('REDIS_URL');
                const host = configService.get<string>('REDIS_HOST', 'localhost');
                const port = configService.get<number>('REDIS_PORT', 6002);

                const redisUrl =
                    explicitUrl || `redis://${host}:${port}`;

                return {
                    stores: [new KeyvRedis(redisUrl)],
                    ttl: 5 * 1000,
                };
            },
        }),
    ],
    providers: [CacheService, BusinessCacheRepository],
    exports: [CacheService, BusinessCacheRepository],
})
export class CustomCacheModule {}
