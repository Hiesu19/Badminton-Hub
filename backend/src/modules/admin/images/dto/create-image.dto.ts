import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourtImageType } from 'src/shared/enums/court.enum';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageGalleryItemDto } from './create-image-gallery-item.dto';

export class CreateImageDto {
  @ApiProperty({
    enum: CourtImageType,
    example: CourtImageType.GALLERY,
    description: 'Kiểu ảnh (banner/avatar/gallery)',
  })
  @IsEnum(CourtImageType)
  type: CourtImageType;

  @ApiPropertyOptional({
    description: 'Key tham chiếu để dễ tìm ảnh',
    example: 'court-avatar',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  key?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn ảnh (bắt buộc nếu không phải gallery)',
    example: 'https://cdn.example.com/court.jpg',
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'Danh sách ảnh khi dùng gallery',
    type: [CreateImageGalleryItemDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateImageGalleryItemDto)
  galleryItems?: CreateImageGalleryItemDto[];

  @ApiPropertyOptional({
    description: 'Độ ưu tiên hiển thị (thấp hơn thì hiện trước)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Id cụm sân mà ảnh thuộc về',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  supperCourtId?: string;
}
