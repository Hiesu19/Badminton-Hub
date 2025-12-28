import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateOwnerSupperCourtDto {
  @ApiPropertyOptional({ example: 'Sân cầu lông HUST - Cơ sở 1' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  name?: string;

  @ApiPropertyOptional({
    example: 'Sân cầu lông chất lượng cao, 6 sân, có bãi gửi xe',
  })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  description?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  phone?: string;

  @ApiPropertyOptional({ example: 'contact@sancau.com' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  email?: string;

  @ApiPropertyOptional({ example: 'https://sancau.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    example:
      'https://badminton-hub.s3.ap-southeast-1.amazonaws.com/supper-court.jpg',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Vietcombank' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  bankName?: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  bankAccountNumber?: string;
}
