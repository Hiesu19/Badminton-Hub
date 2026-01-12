import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { CourtImageType } from 'src/shared/enums/court.enum';

@Exclude()
export class ImageResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Id ảnh',
    example: 123,
  })
  id: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Key để nhận diện ảnh',
    example: 'court-gallery-1',
  })
  key?: string;

  @Expose()
  @ApiProperty({
    description: 'Đường dẫn đến ảnh',
    example: 'https://cdn.example.com/court-1.jpg',
  })
  url: string;

  @Expose()
  @ApiProperty({
    enum: CourtImageType,
    description: 'Loại ảnh',
  })
  type: CourtImageType;

  @Expose()
  @ApiProperty({
    description: 'Độ ưu tiên hiển thị (chỉ số nhỏ hơn hiển thị sớm hơn)',
    example: 1,
  })
  priority: number;

  @Expose()
  @Transform(({ obj }) => (obj.supperCourt ? obj.supperCourt.id : null))
  @ApiPropertyOptional({
    description: 'Id cụm sân liên kết (nếu có)',
    example: 1,
  })
  supperCourtId?: number | null;

  @Expose()
  @ApiProperty({
    description: 'Thời điểm tạo',
    example: '2024-11-30T09:12:04.123Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Thời điểm cập nhật mới nhất',
    example: '2024-11-30T09:12:04.123Z',
  })
  updatedAt: Date;
}
