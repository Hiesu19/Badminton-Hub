import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class PresignedBrandImageDto {
    @ApiProperty({
        example: '1',
    })
    @IsString()
    @IsNotEmpty()
    brandId: string;

    @ApiProperty({
        example: 'image/jpeg',
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(['image/jpeg', 'image/png', 'image/jpg'])
    contentType: string;
}