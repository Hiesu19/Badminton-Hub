import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RefreshTokenResponseDto {
    @Expose()
    @ApiProperty({ example: 'new-access-token' })
    accessToken: string;

    @Expose()
    @ApiProperty({ example: 'new-refresh-token' })
    refreshToken: string;
}
