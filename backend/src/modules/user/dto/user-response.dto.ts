import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
    @Expose()
    @ApiProperty({ example: '1' })
    id: string;

    @Expose()
    @ApiProperty({ example: 'Nguyen Thai Hieu' })
    username: string;

    @Expose()
    @ApiProperty({ example: 'thaihieu191@gmail.com' })
    email: string;

    @Expose()
    @ApiProperty({ example: true })
    isActive: boolean;

    @Expose()
    @ApiProperty({ example: new Date() })
    createdAt: Date;
}
