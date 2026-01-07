import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PresignedBookingBillImageDto {
  @ApiProperty({
    description: 'Id của booking cần đính kèm bill',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({
    description: 'Loại nội dung muốn upload (image/jpeg|image/png)',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;
}
