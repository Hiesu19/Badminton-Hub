import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ReviewUserResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'Id người dùng' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Nguyen Hieu', description: 'Tên người dùng' })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Ảnh đại diện',
  })
  avatarUrl: string;
}

@Exclude()
export class ReviewSupperCourtResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'Id cụm sân' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Sân cầu lông HUST', description: 'Tên cụm sân' })
  name: string;
}

@Exclude()
export class ReviewResponseDto {
  @Expose()
  @ApiProperty({ example: '1', description: 'Id review' })
  id: number;

  @Expose()
  @ApiProperty({ example: 5, description: 'Điểm đánh giá' })
  rating: number;

  @Expose()
  @ApiProperty({
    example: 'Sân đẹp, nhân viên thân thiện',
    description: 'Nhận xét',
    nullable: true,
  })
  comment: string | null;

  @Expose()
  @ApiProperty({
    example: '2026-01-01T10:00:00.000Z',
    description: 'Thời điểm tạo',
  })
  createdAt: Date;

  @Expose()
  @Type(() => ReviewUserResponseDto)
  @ApiProperty({
    type: ReviewUserResponseDto,
    description: 'Thông tin người dùng',
  })
  user: ReviewUserResponseDto;

  @Expose()
  @Type(() => ReviewSupperCourtResponseDto)
  @ApiProperty({
    type: ReviewSupperCourtResponseDto,
    description: 'Thông tin cụm sân',
  })
  supperCourt: ReviewSupperCourtResponseDto;
}
