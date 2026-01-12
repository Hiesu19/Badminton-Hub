import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { SupperCourtResponseDto } from './supper-court-response.dto';

@Exclude()
export class SupperCourtOwnerInfoDto {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Nguyen Van A' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'owner@example.com' })
  email: string;

  @Expose()
  @ApiPropertyOptional({ example: '0123456789' })
  phone?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'https://...' })
  avatarUrl?: string;

  @Expose()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

@Exclude()
export class SupperCourtImageDto {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'supper-courts/1/banner.jpg' })
  key: string;

  @Expose()
  @ApiProperty({ example: 'https://...' })
  url: string;

  @Expose()
  @ApiProperty({ example: 'banner' })
  type: string;

  @Expose()
  @ApiPropertyOptional({ example: 1 })
  priority?: number;
}

@Exclude()
export class SupperCourtDetailResponseDto extends SupperCourtResponseDto {
  @Expose()
  @Type(() => SupperCourtOwnerInfoDto)
  owner: SupperCourtOwnerInfoDto;

  @Expose()
  @ApiPropertyOptional({ example: 'https://...' })
  qrCodeUrl?: string;

  @Expose()
  @Type(() => SupperCourtImageDto)
  images: SupperCourtImageDto[];

  @Expose()
  @ApiProperty({ example: 42, description: 'Tổng số booking đã đặt tại sân' })
  bookingCount: number;
}
