import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();

            const message =
                typeof res === 'string' ? res : (res as any).message || res;

            return response.status(status).json({
                statusCode: status,
                message,
            });
        }

        console.log(exception);

        return response.status(500).json({
            statusCode: 500,
            message: exception?.message || 'Lỗi server',
        });
    }
}
