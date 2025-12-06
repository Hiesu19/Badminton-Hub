import { applyDecorators, HttpCode, Type } from '@nestjs/common';
import {
    ApiOperation,
    ApiExtraModels,
    getSchemaPath,
    ApiResponse,
} from '@nestjs/swagger';
import { HttpRes } from './http-response.decorator';
import { HttpResType } from './http-response.decorator';

function buildSchema(type: HttpResType, options: any) {
    const schema: any = {
        type: 'object',
        properties: {
            code: { type: 'number', example: options.code || 200 },
            message: {
                type: 'string',
                example: options.message || 'Thành công',
            },
        },
    };

    const isCheck =
        type === 'string' || type === 'number' || type === 'boolean';

    if (options.isPagination) {
        schema.properties.data = {
            type: 'array',
            items: isCheck
                ? { type }
                : { $ref: getSchemaPath(Array.isArray(type) ? type[0] : type) },
        };

        schema.properties.metadata = {
            type: 'object',
            properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                total: { type: 'number', example: 100 },
            },
        };
    } else {
        if (Array.isArray(type)) {
            schema.properties.data = {
                type: 'array',
                items: { $ref: getSchemaPath(type[0]) },
            };
        } else if (isCheck) {
            schema.properties.data = { type };
        } else {
            schema.properties.data = { $ref: getSchemaPath(type) };
        }
    }

    return schema;
}

export const CustomResponse = (
    type: HttpResType,
    options: {
        isPagination?: boolean;
        message?: string;
        description?: string;
        code?: number;
    } = {},
) => {
    const isCheck =
        type === 'string' || type === 'number' || type === 'boolean';

    if (isCheck) {
        return applyDecorators(
            HttpRes(type, options),
            HttpCode(options.code || 200),
            // ApiOkResponse({
            //     schema: buildSchema(type, options),
            // }),
            ApiResponse({
                schema: buildSchema(type, options),
                status: options.code || 200,
            }),
            ApiOperation({ summary: options.description || 'Thành công' }),
        );
    } else {
        return applyDecorators(
            HttpRes(type, options),
            HttpCode(options.code || 200),
            // ApiOkResponse({
            //     schema: buildSchema(type, options),
            // }),
            ApiResponse({
                schema: buildSchema(type, options),
                status: options.code || 200,
            }),
            ApiOperation({ summary: options.description || 'Thành công' }),
            ApiExtraModels(Array.isArray(type) ? type[0] : type),
        );
    }
};
