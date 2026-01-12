import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserStatsResponseDto {
  @Expose()
  @ApiProperty({
    example: 348,
    description: 'Tổng số tài khoản người dùng (role USER)',
  })
  totalUsers: number;
}
