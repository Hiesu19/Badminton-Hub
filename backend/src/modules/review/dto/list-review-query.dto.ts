import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ListReviewQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Lọc theo id cụm sân',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  supperCourtId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Trang hiện tại (>= 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Số bản ghi mỗi trang (>= 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
