import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { ConfigService } from '@nestjs/config';

type PresignedPostCondition =
    | ['eq', string, string]
    | ['starts-with', string, string]
    | ['content-length-range', number, number];

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly region: string;

    private readonly MAX_FILE_SIZE = 3 * 1024 * 1024;
    private readonly ALLOWED_CONTENT_TYPES = [
        'image/jpeg',
        'image/png',
        'image/jpg',
    ];

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.getOrThrow<string>('AWS_S3_REGION');
        this.bucketName =
            this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId:
                    this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow<string>(
                    'AWS_SECRET_ACCESS_KEY',
                ),
            },
        });
    }

    async getPresignedPostUrl(key: string, contentType: string) {
        if (!this.ALLOWED_CONTENT_TYPES.includes(contentType)) {
            throw new BadRequestException(
                'Loại file không hợp lệ. Chỉ chấp nhận JPG, PNG.',
            );
        }

        const conditions: PresignedPostCondition[] = [
            ['eq', '$Content-Type', contentType],
            ['content-length-range', 0, this.MAX_FILE_SIZE],
        ];

        const presignedPost = await createPresignedPost(this.s3Client, {
            Bucket: this.bucketName,
            Key: key,
            Conditions: conditions,
            Fields: {
                'Content-Type': contentType,
            },
            Expires: 1000,
        });

        return presignedPost;
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            await this.s3Client.send(command);
        } catch (error) {
            console.error('Lỗi khi xoá file S3:', error);
        }
    }

    getPublicUrl(key: string): string {
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }

    getKeyFromPublicUrl(url: string): string {
        try {
            const { pathname } = new URL(url);
            return pathname.startsWith('/') ? pathname.slice(1) : pathname;
        } catch (error) {
            return url;
        }
    }
}
