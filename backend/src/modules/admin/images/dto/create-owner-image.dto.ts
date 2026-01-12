import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourtImageType } from 'src/shared/enums/court.enum';
import {
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOwnerImageDto {
  @ApiProperty({
    description: 'Đường dẫn ảnh',
    example: 'https://cdn.example.com/court-1.jpg',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Loại ảnh',
    enum: CourtImageType,
    example: CourtImageType.GALLERY,
  })
  @IsEnum(CourtImageType)
  type: CourtImageType;

  @ApiPropertyOptional({
    description: 'Độ ưu tiên hiển thị, chỉ số nhỏ hơn hiển thị trước',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Key ảnh (để dễ nhận diện nếu cần)',
    example: 'gallery-1',
  })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional({
    description: 'Nếu có nhiều supper court, có thể chỉ định cụ thể',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  supperCourtId?: string;
}

