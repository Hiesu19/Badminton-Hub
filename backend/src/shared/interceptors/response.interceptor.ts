import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import {
    HTTP_RES_KEY,
    HttpResOptions,
} from '../decorators/http-response.decorator';

export interface Response<T> {
    code: number;
    message: string;
    data?: T;
    metadata?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const metadata = this.reflector.get<HttpResOptions>(
            HTTP_RES_KEY,
            context.getHandler(),
        );
        if (!metadata) {
            return next.handle();
        }
        const { type: dto, isPagination, message = 'Thành công' } = metadata;

        return next.handle().pipe(
            map((data) => {
                const httpContext = context.switchToHttp();
                const response = httpContext.getResponse();
                const statusCode = response.statusCode;

                const transform = (rawData: any) => {
                    if (
                        dto === 'string' ||
                        dto === 'number' ||
                        dto === 'boolean'
                    ) {
                        return rawData;
                    }
                    const transformDto = Array.isArray(dto) ? dto[0] : dto;
                    if (!transformDto) {
                        return rawData;
                    }
                    return plainToInstance(transformDto, rawData, {
                        excludeExtraneousValues: true,
                    });
                };

                // Phan trang
                if (isPagination) {
                    const { data: results, ...other } = data;

                    return {
                        code: statusCode,
                        message,
                        data: transform(results),
                        metadata: other,
                    };
                }

                if (Array.isArray(dto)) {
                    const { data: results, ...other } = data;
                    return {
                        code: statusCode,
                        message,
                        data: transform(results),
                    };
                }

                return {
                    code: statusCode,
                    message,
                    data: transform(data),
                };
            }),
        );
    }
}
