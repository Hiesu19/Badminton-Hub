import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailDto {
    @ApiProperty({ example: 'thaihieu1@gmail.com' })
    @IsEmail()
    email: string;
}
