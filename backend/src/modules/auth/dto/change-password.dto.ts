import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    oldPassword: string;

    @ApiProperty({ example: 'Hieu123@' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
        },
    )
    newPassword: string;
}
