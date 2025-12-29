import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

class User {
  @Expose()
  @ApiProperty({ example: '1' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'super_admin' })
  role: string;

  @Expose()
  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatarUrl: string;

  @Expose()
  @ApiProperty({ example: 'Nguyen Van A' })
  fullName: string;
}
@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty({ example: 'access-token' })
  accessToken: string;

  @Expose()
  @ApiProperty({ example: 'refresh-token' })
  refreshToken: string;

  @Expose()
  @ApiProperty({ example: { id: '1', role: 'super_admin', email: 'admin@example.com', avatarUrl: 'https://example.com/avatar.jpg' } })
  user: User;
}
