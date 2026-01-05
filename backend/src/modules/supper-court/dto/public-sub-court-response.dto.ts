import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PublicSubCourtResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Id sân con' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Sân 1', description: 'Tên sân con' })
  name: string;
}
