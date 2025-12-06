import { SetMetadata, Type } from '@nestjs/common';

export const HTTP_RES_KEY = 'HTTP_RES_KEY';

export interface HttpResOptions {
    type: any;
    isPagination?: boolean;
    message?: string;
}
export type HttpResType =
    | Type<any>
    | [Type<any>]
    | 'string'
    | 'number'
    | 'boolean'

export const HttpRes = (
    type: HttpResType,
    options: { isPagination?: boolean; message?: string, code?: number } = {},
) => SetMetadata(HTTP_RES_KEY, { type, ...options });
