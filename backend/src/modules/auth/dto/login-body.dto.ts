import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
export class LoginDto {
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
}
