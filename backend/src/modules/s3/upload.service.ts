import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import { PresignedProductImageDto } from './dto/presigned-product-image.dto';
import { PresignedAvatarImageDto } from './dto/presigned-avatar-image.dto';
import { PresignedCategoryImageDto } from './dto/presigned-categrory-image.dto';
import { PresignedBrandImageDto } from './dto/presigned-brand-image.dto';

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

    async getPresignedProductImageUrl(body: PresignedProductImageDto) {
        const { productId, contentType, position } = body;

        const extension = this.getExtensionFromContentType(contentType);
        if (!extension) {
            throw new BadRequestException('ContentType không hợp lệ');
        }

        const s3Key = `products/${productId}/${position}${extension}`;

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
                    : 'Không thể tạo presigned product image URL';
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

    async getPresignedCategoryImageUrl(body: PresignedCategoryImageDto) {
        const { categoryId, contentType } = body;

        const extension = this.getExtensionFromContentType(contentType);
        if (!extension) {
            throw new BadRequestException('ContentType không hợp lệ');
        }

        const s3Key = `categories/${categoryId}/image${extension}`;

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
                    : 'Không thể tạo presigned category image URL';
            throw new BadRequestException(message);
        }
    }

    async getPresignedBrandImageUrl(body: PresignedBrandImageDto) {
        const { brandId, contentType } = body;

        const extension = this.getExtensionFromContentType(contentType);
        if (!extension) {
            throw new BadRequestException('ContentType không hợp lệ');
        }

        const s3Key = `brands/${brandId}/image${extension}`;

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
                    : 'Không thể tạo presigned category image URL';
            throw new BadRequestException(message);
        }
    }
}
