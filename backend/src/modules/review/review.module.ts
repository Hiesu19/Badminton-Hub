import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupperCourtEntity } from '../../database/entities/supper-court.entity';
import { ReviewEntity } from '../../database/entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, SupperCourtEntity]), JwtModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
