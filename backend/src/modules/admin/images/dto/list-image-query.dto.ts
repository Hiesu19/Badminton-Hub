import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourtImageType } from 'src/shared/enums/court.enum';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';

export class ListImageQueryDto {
  @ApiPropertyOptional({
    enum: CourtImageType,
    description: 'Lọc theo dạng ảnh (banner/avatar/gallery)',
  })
  @IsOptional()
  @IsEnum(CourtImageType)
  type?: CourtImageType;

  @ApiPropertyOptional({
    description: 'Lọc theo supper court (id)',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  supperCourtId?: string;
}
