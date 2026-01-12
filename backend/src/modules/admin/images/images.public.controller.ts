import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { ImageResponseDto } from './dto/image-response.dto';
import { ListImageQueryDto } from './dto/list-image-query.dto';
import { ImagesService } from './images.service';

@Controller('/images')
@ApiTags('Images')
export class PublicImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @CustomResponse([ImageResponseDto], {
    message: 'Danh sách ảnh công khai',
    description: 'Lấy ảnh theo filter loại hoặc cụm sân (public)',
  })
  async list(@Query() query: ListImageQueryDto) {
    return this.imagesService.listPublic(query);
  }
}
