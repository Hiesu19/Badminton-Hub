import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateSupperCourtDto {
  @ApiProperty({ example: 'Sân cầu lông HUST' })
  @IsString()
  @IsNotEmpty({ message: 'Tên sân không được để trống' })
  @Length(2, 255, { message: 'Tên sân phải từ 2 - 255 ký tự' })
  name: string;

  @ApiProperty({ example: 'Sân cầu lông chất lượng cao, 6 sân, có bãi gửi xe' })
  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @Length(2, 255, { message: 'Mô tả phải từ 2 - 255 ký tự' })
  description: string;

  @ApiProperty({ example: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội' })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @Length(2, 255, { message: 'Địa chỉ phải từ 2 - 255 ký tự' })
  address: string;

  @ApiProperty({
    example: 'https://maps.app.goo.gl/HmqB91Mpma2T37918',
  })
  @IsString()
  @IsNotEmpty({ message: 'Link địa chỉ không được để trống' })
  @Length(2, 255, { message: 'Link địa chỉ phải từ 2 - 255 ký tự' })
  addressLink: string;

  @ApiProperty({
    example: 21.004567,
    description: 'Vĩ độ (latitude) của cụm sân',
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Latitude phải là số' })
  @Min(-90, { message: 'Latitude không hợp lệ' })
  @Max(90, { message: 'Latitude không hợp lệ' })
  latitude: number;

  @ApiProperty({
    example: 105.843123,
    description: 'Kinh độ (longitude) của cụm sân',
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Longitude phải là số' })
  @Min(-180, { message: 'Longitude không hợp lệ' })
  @Max(180, { message: 'Longitude không hợp lệ' })
  longitude: number;

  @ApiProperty({ example: '0987654321' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Length(8, 20, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @ApiPropertyOptional({ example: 'contact@sancau.com' })
  @IsString()
  @IsOptional()
  @Length(0, 255, { message: 'Email tối đa 255 ký tự' })
  email?: string;

  @ApiPropertyOptional({ example: 'https://sancau.com' })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Website phải là một URL hợp lệ' })
  website?: string;

  @ApiProperty({ example: 'Vietcombank' })
  @IsString()
  @IsNotEmpty({ message: 'Tên ngân hàng không được để trống' })
  @Length(2, 255, { message: 'Tên ngân hàng phải từ 2 - 255 ký tự' })
  bankName: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty({ message: 'Số tài khoản không được để trống' })
  @Length(2, 255, { message: 'Số tài khoản phải từ 2 - 255 ký tự' })
  bankAccountNumber: string;

  @ApiPropertyOptional({
    example:
      'https://badminton-hub.s3.ap-southeast-1.amazonaws.com/supper-court.jpg',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'URL ảnh tối đa 500 ký tự' })
  imageUrl?: string;
}
