import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { SupperCourtStatus } from 'src/shared/enums/supper-court.enum';
import { CourtImageType } from 'src/shared/enums/court.enum';

@Exclude()
export class PublicSupperCourtImageDto {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string;

  @Expose()
  @ApiProperty({
    example:
      'https://badminton-hub.s3.ap-southeast-1.amazonaws.com/supper-court-1.jpg',
  })
  url: string;

  @Expose()
  @ApiProperty({
    enum: CourtImageType,
    example: CourtImageType.SUPPER_COURT,
  })
  type: CourtImageType;

  @Expose()
  @ApiProperty({ example: 1 })
  priority: number;
}

@Exclude()
export class PublicSupperCourtResponseDto {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Sân cầu lông HUST' })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'Sân cầu lông chất lượng cao, 6 sân, có bãi gửi xe',
  })
  description: string;

  @Expose()
  @ApiProperty({ enum: SupperCourtStatus, example: SupperCourtStatus.ACTIVE })
  status: SupperCourtStatus;

  @Expose()
  @ApiProperty({ example: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội' })
  address: string;

  @Expose()
  @ApiProperty({
    example:
      'https://www.google.com/maps/place/S%C3%A2n+c%E1%BA%A7u+l%C3%B4ng+HUST',
  })
  addressLink: string;

  @Expose()
  @ApiPropertyOptional({ example: '0987654321' })
  phone?: string | null;

  @Expose()
  @ApiPropertyOptional({ example: 'contact@sancau.com' })
  email?: string | null;

  @Expose()
  @ApiPropertyOptional({ example: 'https://sancau.com' })
  website?: string | null;

  @Expose()
  @ApiProperty({ example: 21.004567 })
  latitude: number;

  @Expose()
  @ApiProperty({ example: 105.843123 })
  longitude: number;

  @Expose()
  @ApiPropertyOptional({ type: [PublicSupperCourtImageDto] })
  @Type(() => PublicSupperCourtImageDto)
  images?: PublicSupperCourtImageDto[];

  @Expose()
  @ApiPropertyOptional({
    example:
      'https://badminton-hub.s3.ap-southeast-1.amazonaws.com/supper-court.jpg',
  })
  imageUrl?: string | null;
}
