import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import { PresignedSupperCourtGalleryImageDto } from './dto/presigned-product-image.dto';
import { PresignedAvatarImageDto } from './dto/presigned-avatar-image.dto';
import { PresignedSupperCourtMainImageDto } from './dto/presigned-categrory-image.dto';
import { PresignedSupperCourtBannerImageDto } from './dto/presigned-brand-image.dto';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  private getExtensionFromContentType(contentType: string): string | null {
    switch (contentType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/jpg':
        return '.jpg';
      case 'image/png':
        return '.png';
      default:
        return null;
    }
  }

  // Lấy URL upload ảnh gallery cho sân
  async getPresignedSupperCourtGalleryImageUrl(
    body: PresignedSupperCourtGalleryImageDto,
  ) {
    const { supperCourtId, contentType, position } = body;

    const extension = this.getExtensionFromContentType(contentType);
    if (!extension) {
      throw new BadRequestException('ContentType không hợp lệ');
    }

    const s3Key = `supper-courts/${supperCourtId}/gallery-${position}${extension}`;

    try {
      const { url, fields } = await this.s3Service.getPresignedPostUrl(
        s3Key,
        contentType,
      );

      return {
        url,
        fields,
        publicUrl: this.s3Service.getPublicUrl(s3Key),
        key: s3Key,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể tạo presigned supper court gallery image URL';
      throw new BadRequestException(message);
    }
  }

  async getPresignedAvatarImageUrl(
    userId: string,
    body: PresignedAvatarImageDto,
  ) {
    const { contentType } = body;

    const extension = this.getExtensionFromContentType(contentType);
    if (!extension) {
      throw new BadRequestException('ContentType không hợp lệ');
    }

    const s3Key = `users/${userId}/avatar${extension}`;

    try {
      const { url, fields } = await this.s3Service.getPresignedPostUrl(
        s3Key,
        contentType,
      );

      return {
        url,
        fields,
        publicUrl: this.s3Service.getPublicUrl(s3Key),
        key: s3Key,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể tạo presigned avatar image URL';
      throw new BadRequestException(message);
    }
  }

  // Lấy URL upload ảnh đại diện sân
  async getPresignedSupperCourtMainImageUrl(
    body: PresignedSupperCourtMainImageDto,
  ) {
    const { supperCourtId, contentType } = body;

    const extension = this.getExtensionFromContentType(contentType);
    if (!extension) {
      throw new BadRequestException('ContentType không hợp lệ');
    }

    const s3Key = `supper-courts/${supperCourtId}/main${extension}`;

    try {
      const { url, fields } = await this.s3Service.getPresignedPostUrl(
        s3Key,
        contentType,
      );

      return {
        url,
        fields,
        publicUrl: this.s3Service.getPublicUrl(s3Key),
        key: s3Key,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể tạo presigned supper court main image URL';
      throw new BadRequestException(message);
    }
  }

  // Lấy URL upload banner sân
  async getPresignedSupperCourtBannerImageUrl(
    body: PresignedSupperCourtBannerImageDto,
  ) {
    const { supperCourtId, contentType } = body;

    const extension = this.getExtensionFromContentType(contentType);
    if (!extension) {
      throw new BadRequestException('ContentType không hợp lệ');
    }

    const s3Key = `supper-courts/${supperCourtId}/banner${extension}`;

    try {
      const { url, fields } = await this.s3Service.getPresignedPostUrl(
        s3Key,
        contentType,
      );

      return {
        url,
        fields,
        publicUrl: this.s3Service.getPublicUrl(s3Key),
        key: s3Key,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể tạo presigned supper court banner image URL';
      throw new BadRequestException(message);
    }
  }
}
