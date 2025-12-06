import { Controller, Post, Body, Req } from '@nestjs/common';
import { AdminAuth, UserAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { GetPresignedUrlResponseDto } from './dto/get-presigned-product-url-response.dto';
import { PresignedProductImageDto } from './dto/presigned-product-image.dto';
import { UploadService } from './upload.service';
import { PresignedAvatarImageDto } from './dto/presigned-avatar-image.dto';
import { PresignedCategoryImageDto } from './dto/presigned-categrory-image.dto';
import { PresignedBrandImageDto } from './dto/presigned-brand-image.dto';

@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('presigned-product-image')
    @AdminAuth()
    @CustomResponse(GetPresignedUrlResponseDto, {
        description: '[admin] Lấy key để upload file',
        message: 'Lấy key để upload file thành công',
    })
    async getPresignedProductImageUrl(@Body() body: PresignedProductImageDto) {
        return this.uploadService.getPresignedProductImageUrl(body);
    }

    @Post('presigned-avatar-image')
    @UserAuth()
    @CustomResponse(GetPresignedUrlResponseDto, {
        description: '[user] Lấy key để upload avatar image',
        message: 'Lấy key để upload avatar image thành công',
    })
    async getPresignedAvatarImageUrl(
        @Req() req: Request & { user: any },
        @Body() body: PresignedAvatarImageDto,
    ) {
        return this.uploadService.getPresignedAvatarImageUrl(req.user.id, body);
    }

    @Post('presigned-category-image')
    @AdminAuth()
    @CustomResponse(GetPresignedUrlResponseDto, {
        description: '[admin] Lấy key để upload category image',
        message: 'Lấy key để upload category image thành công',
    })
    async getPresignedCategoryImageUrl(@Body() body: PresignedCategoryImageDto) {
        return this.uploadService.getPresignedCategoryImageUrl(body);
    }

    @Post('presigned-brand-image')
    @AdminAuth()
    @CustomResponse(GetPresignedUrlResponseDto, {
        description: '[admin] Lấy key để upload brand image',
        message: 'Lấy key để upload brand image thành công',
    })
    async getPresignedBrandImageUrl(@Body() body: PresignedBrandImageDto) {
        return this.uploadService.getPresignedBrandImageUrl(body);
    }
}
