import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
export class LoginDto {
  @ApiProperty({ example: 'thaihieu1@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Hieu123@' })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
    },
  )
  password: string;
}
