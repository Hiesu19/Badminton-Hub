import { ApiProperty } from '@nestjs/swagger';

export class ReviewSummaryResponseDto {
  @ApiProperty({
    example: 4.9,
    description: 'Điểm trung bình (một chữ số thập phân). Null nếu chưa có đánh giá.',
    nullable: true,
  })
  rating: number | null;

  @ApiProperty({
    example: 12,
    description: 'Tổng số review của cụm sân',
  })
  reviewCount: number;
}

