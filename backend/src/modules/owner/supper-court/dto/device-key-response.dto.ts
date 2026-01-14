import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

class SubCourtInfo {
  @Expose()
  @ApiProperty({ example: 1, description: 'ID sân con' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Sân phụ 1', description: 'Tên sân con' })
  name: string;
}

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

  @Expose()
  @Type(() => SubCourtInfo)
  @ApiProperty({
    description: 'Danh sách sân con của chủ sân',
    type: [SubCourtInfo],
    example: [{ id: 1, name: 'Sân phụ A' }],
  })
  subCourts: SubCourtInfo[];
}
