import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateImageDto {
  @ApiPropertyOptional({
    description: 'Key tham chiếu để dễ tìm ảnh',
    example: 'court-avatar',
  })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn ảnh',
    example: 'https://cdn.example.com/court.jpg',
  })
  @IsOptional()
  @IsUrl()
  url?: string;

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
    description: 'Id cụm sân (mặc định giữ nguyên nếu không gửi)',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  supperCourtId?: string;
}
