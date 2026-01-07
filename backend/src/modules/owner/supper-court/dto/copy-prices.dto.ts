import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class CopyPricesDto {
  @ApiProperty({
    example: 1,
    description:
      'Thứ trong tuần nguồn (copy từ): 0 = CN, 1 = Thứ 2, ..., 6 = Thứ 7',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeekFrom: number;

  @ApiProperty({
    example: 2,
    description:
      'Thứ trong tuần đích (copy sang): 0 = CN, 1 = Thứ 2, ..., 6 = Thứ 7',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeekTo: number;
}
