import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
    @ApiProperty({ description: 'Trạng thái kích hoạt của người dùng' })
    @IsBoolean()
    isActive: boolean;
}
