import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeviceKeyResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Key dùng để device kết nối',
    example: '3a9f1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
  })
  deviceKey?: string | null;

  @Expose()
  @ApiProperty({
    description: 'Id supper court',
    example: 12,
  })
  supperCourtId: number;
}
