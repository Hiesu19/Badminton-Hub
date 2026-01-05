import { ApiProperty } from '@nestjs/swagger';

export class PublicSupperCourtPriceMatrixSlotDto {
  @ApiProperty({ description: 'Id bản ghi giá', nullable: true, example: 1 })
  priceId: number | null;

  @ApiProperty({
    description: 'Giá thuê 30 phút (VNĐ/giờ)',
    nullable: true,
    example: 50000,
  })
  price: number | null;

  @ApiProperty({
    description: 'Giờ bắt đầu slot (HH:mm)',
    example: '05:00',
  })
  startTime: string;

  @ApiProperty({
    description: 'Giờ kết thúc slot (HH:mm)',
    example: '05:30',
  })
  endTime: string;
}
