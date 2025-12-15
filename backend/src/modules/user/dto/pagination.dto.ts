import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 1))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 10))
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ default: "thaihieu1919@gmail.com" })
    @IsOptional()
    @IsString()
    search?: string;
}
