import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CustomCacheModule } from '../redis/custom-cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule, CustomCacheModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
