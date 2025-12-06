import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class PresignedCategoryImageDto {
    @ApiProperty({
        example: '1',
    })
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({
        example: 'image/jpeg',
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(['image/jpeg', 'image/png', 'image/jpg'])
    contentType: string;
}