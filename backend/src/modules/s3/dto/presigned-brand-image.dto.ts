import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

// Dùng cho ảnh banner của sân
export class PresignedSupperCourtBannerImageDto {
  @ApiProperty({
    example: '1',
    description: 'ID của sân (supper court)',
  })
  @IsString()
  @IsNotEmpty()
  supperCourtId: string;

  @ApiProperty({
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['image/jpeg', 'image/png', 'image/jpg'])
  contentType: string;
}