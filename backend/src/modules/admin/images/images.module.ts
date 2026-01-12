import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { ImageEntity } from '../../../database/entities/court-image.entity';
import { ImagesController } from './images.controller';
import { PublicImagesController } from './images.public.controller';
import { ImagesService } from './images.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity, SupperCourtEntity]),
    JwtModule,
  ],
  controllers: [ImagesController, PublicImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
