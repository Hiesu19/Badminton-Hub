import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImageGalleryItemDto {
  @ApiProperty({
    description: 'Đường dẫn ảnh',
    example: 'https://cdn.example.com/court-1.jpg',
  })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({
    description: 'Độ ưu tiên hiển thị (thấp hơn thì lên trước)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Key tham chiếu cho ảnh',
    example: 'gallery-1',
  })
  @IsOptional()
  @IsString()
  key?: string;
}
