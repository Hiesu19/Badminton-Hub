import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    Matches,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Nguyen Hieu' })
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 'thaihieu1@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Hieu123@' })
    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
        },
    )
    password: string;

    @ApiProperty({ example: '+84898610991' })
    @IsNotEmpty()
    @IsPhoneNumber('VN', {
        message:
            'Số điện thoại không hợp lệ hoặc không phải số điện thoại Việt Nam',
    })
    phone: string;
}
