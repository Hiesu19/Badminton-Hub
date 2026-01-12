import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { SupperCourtStatus } from 'src/shared/enums/supper-court.enum';

@Exclude()
export class SupperCourtUserResponseDto {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string;
  @Expose()
  @ApiProperty({ example: 'Nguyen Van A' })
  name: string;
}

@Exclude()
export class SupperCourtResponseDto {
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
  @ApiProperty({
    enum: SupperCourtStatus,
    example: SupperCourtStatus.VERIFYING,
  })
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
  @ApiProperty({ example: '0987654321' })
  phone: string;

  @Expose()
  @ApiPropertyOptional({ example: 'contact@sancau.com' })
  email?: string | null;

  @Expose()
  @ApiPropertyOptional({ example: 'https://sancau.com' })
  website?: string | null;

  @Expose()
  @ApiProperty({ example: 'Vietcombank' })
  bankName: string;

  @Expose()
  @ApiProperty({ example: '0123456789' })
  bankAccountNumber: string;

  @Expose()
  @ApiProperty({ example: 21.004567 })
  latitude: number;

  @Expose()
  @ApiProperty({ example: 105.843123 })
  longitude: number;

  @Expose()
  @ApiPropertyOptional({
    example:
      'https://badminton-hub.s3.ap-southeast-1.amazonaws.com/supper-court.jpg',
  })
  imageUrl?: string | null;

  @Expose()
  @ApiProperty({ type: SupperCourtUserResponseDto })
  @Type(() => SupperCourtUserResponseDto)
  user: SupperCourtUserResponseDto;

  @Expose()
  @ApiProperty({ example: '2021-01-01 10:00:00' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2021-01-01 10:00:00' })
  updatedAt: Date;
}
