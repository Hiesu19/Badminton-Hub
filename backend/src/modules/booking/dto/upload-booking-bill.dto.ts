import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class UploadBookingBillDto {
  @ApiProperty({
    description: 'Ảnh bill chuyển khoản (url công khai sau khi upload S3)',
    example:
      'https://bucket.s3.region.amazonaws.com/users/123/booking-bill.jpg',
    maxLength: 500,
  })
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  imgBill: string;
}
