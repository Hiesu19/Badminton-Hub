import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyRegisterOtpDto {
    @ApiProperty({ example: 'thaihieu1@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '888888' })
    @IsString()
    otp: string;
}
