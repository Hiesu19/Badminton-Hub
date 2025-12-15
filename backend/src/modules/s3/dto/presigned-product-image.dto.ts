import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

// Dùng cho ảnh gallery của sân (supper court)
export class PresignedSupperCourtGalleryImageDto {
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

  @ApiProperty({
    example: 1,
    description: 'Vị trí ảnh trong gallery',
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  position: number;
}
