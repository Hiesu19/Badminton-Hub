import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListPricesQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description:
      'Lọc theo thứ trong tuần: 0 = CN, 1 = Thứ 2, ..., 6 = Thứ 7. Không truyền = lấy tất cả',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;
}
