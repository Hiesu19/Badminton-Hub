import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class PresignedProductImageDto {
    @ApiProperty({
        example: '1',
    })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({
        example: 'image/jpeg',
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(['image/jpeg', 'image/png', 'image/jpg'])
    contentType: string;

    @ApiProperty({
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    position: number;
}
