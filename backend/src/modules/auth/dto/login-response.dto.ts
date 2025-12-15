import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginResponseDto {
    @Expose()
    @ApiProperty({ example: 'access-token' })
    accessToken: string;

    @Expose()
    @ApiProperty({ example: 'refresh-token' })
    refreshToken: string;
}
