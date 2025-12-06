import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class FieldsDto {
    @Expose()
    @Expose()
    @ApiProperty({
        example: 'image/jpeg',
    })
    'Content-Type': string;

    @Expose()
    @ApiProperty({
        example: '3hieu-web',
    })
    bucket: string;

    @Expose()
    @ApiProperty({
        example: 'AWS4-HMAC-SHA256',
    })
    'X-Amz-Algorithm': string;

    @Expose()
    @ApiProperty({
        example: 'AKIA2HVQ5JTJI74C3LNO/20251105/ap-southeast-1/s3/aws4_request',
    })
    'X-Amz-Credential': string;

    @Expose()
    @ApiProperty({
        example: '20251105T093314Z',
    })
    'X-Amz-Date': string;

    @Expose()
    @ApiProperty({
        example:
            'inVzZXJzL2RkZGM5ZWVhLTc4NGUtNGY2MC04OWI4LTg4NTViZWQzOWJjNy9hdmF0YXIuanBn',
    })
    key: string;

    @Expose()
    @ApiProperty({
        example:
            'eyJleHBpcmF0aW9uIjoiMjAyNS0xMS0wNVQwOTo0OTo1NFoiLCJjb25kaXRpb25zIjpbWyJlcSIsIiRDb250ZW50LVR5cGUiLCJpbWFnZS9qcGVnIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwzMTQ1NzI4XSx7IkNvbnRlbnQtVHlwZSI6ImltYWdlL2pwZWcifSx7ImJ1Y2tldCI6IjNoaWV1LXdlYiJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUEySFZRNUpUSkk3NEMzTE5PLzIwMjUxMTA1L2FwLXNvdXRoZWFzdC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsiWC1BbXotRGF0ZSI6IjIwMjUxMTA1VDA5MzMxNFoifSx7ImtleSI6InVzZXJzL2RkZGM5ZWVhLTc4NGUtNGY2MC04OWI4LTg4NTViZWQzOWJjNy9hdmF0YXIuanBnIn1dfQ==',
    })
    Policy: string;

    @Expose()
    @ApiProperty({
        example:
            'c7742b1dab2dac6c37ec70f63f7ef7a27cda6e16208c6d0a2b4ebab413168978',
    })
    'X-Amz-Signature': string;
}

@Exclude()
export class GetPresignedUrlResponseDto {
    @ApiProperty({
        example: 'https://example.com/upload',
    })
    @Expose()
    url: string;

    @Expose()
    @ApiProperty({
        type: () => FieldsDto,
    })
    @Expose()
    fields: FieldsDto;

    @ApiProperty({
        example: 'https://example.com/upload',
    })
    @Expose()
    publicUrl: string;

    @Expose()
    @ApiProperty({
        example:
            'inVzZXJzL2RkZGM5ZWVhLTc4NGUtNGY2MC04OWI4LTg4NTViZWQzOWJjNy9hdmF0YXIuanBn',
    })
    key: string;
}
