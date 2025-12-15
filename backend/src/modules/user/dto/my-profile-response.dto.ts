import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MyProfileResponseDto {
  @Expose()
  @ApiProperty({
    example: '1',
  })
  id: string;

  // Map từ field `name` của entity sang `fullName` cho FE
  @Expose({ name: 'name' })
  @ApiProperty({
    example: 'Nguyen Hieu',
  })
  fullName: string;

  @Expose()
  @ApiProperty({
    example: 'thaihieu191@gmail.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: '0377070046',
  })
  phone: string | null;

  @Expose()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl: string;

  @Expose()
  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date;
}
