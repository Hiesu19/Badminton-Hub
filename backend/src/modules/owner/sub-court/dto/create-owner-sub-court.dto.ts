import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOwnerSubCourtDto {
  @ApiProperty({ example: 'Sân 1' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;
}
