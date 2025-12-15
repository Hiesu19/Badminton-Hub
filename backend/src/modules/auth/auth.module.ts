import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { CustomCacheModule } from '../redis/custom-cache.module';
import { JwtModule } from '@nestjs/jwt';
import { BusinessCacheRepository } from '../redis/business-cache.repository';
import { SendEmailModule } from '../send-email/sendEmail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CustomCacheModule,
        JwtModule,
        SendEmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, BusinessCacheRepository],
})
export class AuthModule {}
