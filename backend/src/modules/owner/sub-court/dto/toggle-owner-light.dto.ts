import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ToggleOwnerLightDto {
  @ApiProperty({ example: 'on' })
  @IsNotEmpty()
  @IsEnum(['on', 'off'])
  action: 'on' | 'off';
}
