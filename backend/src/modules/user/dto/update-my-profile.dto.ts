import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMyProfileDto {
  @ApiProperty({ example: 'Nguyen Hieu' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '0377070046' })
  @IsOptional()
  @Matches(/^\d{10}$/, {
    message: 'Số điện thoại chỉ được chứa số và dài 10 chữ số',
  })
  phone?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
