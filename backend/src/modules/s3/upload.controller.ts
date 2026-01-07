import { Controller, Post, Body, Req } from '@nestjs/common';
import { OwnerAuth, UserAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { GetPresignedUrlResponseDto } from './dto/get-presigned-product-url-response.dto';
import { PresignedSupperCourtGalleryImageDto } from './dto/presigned-product-image.dto';
import { UploadService } from './upload.service';
import { PresignedAvatarImageDto } from './dto/presigned-avatar-image.dto';
import { PresignedSupperCourtMainImageDto } from './dto/presigned-categrory-image.dto';
import { PresignedSupperCourtBannerImageDto } from './dto/presigned-brand-image.dto';
import { PresignedBookingBillImageDto } from './dto/presigned-booking-bill-image.dto';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-supper-court-gallery-image')
  @OwnerAuth()
  @CustomResponse(GetPresignedUrlResponseDto, {
    description: '[owner] Lấy key để upload ảnh gallery cho sân',
    message: 'Lấy key để upload ảnh gallery cho sân thành công',
  })
  async getPresignedSupperCourtGalleryImageUrl(
    @Body() body: PresignedSupperCourtGalleryImageDto,
  ) {
    return this.uploadService.getPresignedSupperCourtGalleryImageUrl(body);
  }

  @Post('presigned-avatar-image')
  @UserAuth()
  @CustomResponse(GetPresignedUrlResponseDto, {
    description: '[user] Lấy key để upload avatar user',
    message: 'Lấy key để upload avatar user thành công',
  })
  async getPresignedAvatarImageUrl(
    @Req() req: Request & { user: any },
    @Body() body: PresignedAvatarImageDto,
  ) {
    return this.uploadService.getPresignedAvatarImageUrl(req.user.id, body);
  }

  @Post('presigned-supper-court-main-image')
  @OwnerAuth()
  @CustomResponse(GetPresignedUrlResponseDto, {
    description: '[owner] Lấy key để upload ảnh đại diện sân',
    message: 'Lấy key để upload ảnh đại diện sân thành công',
  })
  async getPresignedSupperCourtMainImageUrl(
    @Body() body: PresignedSupperCourtMainImageDto,
  ) {
    return this.uploadService.getPresignedSupperCourtMainImageUrl(body);
  }

  @Post('presigned-supper-court-banner-image')
  @OwnerAuth()
  @CustomResponse(GetPresignedUrlResponseDto, {
    description: '[owner] Lấy key để upload banner sân',
    message: 'Lấy key để upload banner sân thành công',
  })
  async getPresignedSupperCourtBannerImageUrl(
    @Body() body: PresignedSupperCourtBannerImageDto,
  ) {
    return this.uploadService.getPresignedSupperCourtBannerImageUrl(body);
  }

  @Post('presigned-booking-bill-image')
  @UserAuth()
  @CustomResponse(GetPresignedUrlResponseDto, {
    description: '[user] Lấy key để upload bill chuyển khoản',
    message: 'Lấy key upload bill thành công',
  })
  async getPresignedBookingBillImageUrl(
    @Req() req: Request & { user?: any },
    @Body() body: PresignedBookingBillImageDto,
  ) {
    return this.uploadService.getPresignedBookingBillImageUrl(
      req.user.id,
      body,
    );
  }
}
