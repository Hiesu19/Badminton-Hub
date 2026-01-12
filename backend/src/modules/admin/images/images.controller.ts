import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OwnerAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { CreateOwnerImageDto } from './dto/create-owner-image.dto';
import { ImageResponseDto } from './dto/image-response.dto';
import { ListImageQueryDto } from './dto/list-image-query.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesService } from './images.service';

@Controller('/owner/images')
@ApiTags('Owner - Images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @OwnerAuth()
  @CustomResponse([ImageResponseDto], {
    message: 'Lấy danh sách ảnh',
    description: '[owner] Lấy ảnh theo filter (court/type)',
  })
  async list(@Req() req: any, @Query() query: ListImageQueryDto) {
    return this.imagesService.listForOwner(query, req.user?.id);
  }

  @Post()
  @OwnerAuth()
  @CustomResponse([ImageResponseDto], {
    message: 'Tạo ảnh thành công',
    description: '[owner] Tạo một ảnh mới',
  })
  async create(@Req() req: any, @Body() dto: CreateOwnerImageDto) {
    return this.imagesService.createForOwner(dto, req.user?.id);
  }

  @Patch(':id')
  @OwnerAuth()
  @CustomResponse(ImageResponseDto, {
    message: 'Cập nhật ảnh thành công',
    description: '[owner] Cho phép sửa key/url/priority',
  })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateImageDto,
  ) {
    return this.imagesService.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @OwnerAuth()
  @CustomResponse('string', {
    message: 'Xóa ảnh thành công',
    description: '[owner] Xóa một ảnh cụ thể',
  })
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.imagesService.remove(id, req.user?.id);
  }
}
