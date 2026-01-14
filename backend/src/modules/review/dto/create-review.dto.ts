import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'Id cụm sân muốn đánh giá',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  supperCourtId: number;

  @ApiProperty({
    example: 5,
    description: 'Điểm đánh giá (từ 1 đến 5)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'Sân đẹp, nhân viên thân thiện',
    description: 'Nhận xét đi kèm (tối đa 1000 ký tự)',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
