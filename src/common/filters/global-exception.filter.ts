import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Sin argumentos, captura TODAS las excepciones
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        // Obtenemos el contexto HTTP (request y response)
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Determinamos el código de estado HTTP y el mensaje
        const { status, message, errorCode } = this.getErrorInfo(exception);

        // Construimos la respuesta de error estandarizada
        const errorResponse = {
            success: false, // Siempre false para errores
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            errorCode, // Código interno para catalogar tipos de error
        };

        // Logeamos el error con diferente nivel según la gravedad
        this.logError(exception, request, status);

        // Enviamos la respuesta al cliente
        response.status(status).json(errorResponse);
    }

    private getErrorInfo(exception: unknown): {
        status: number;
        message: string;
        errorCode: string;
    } {
        // Si es una HttpException de NestJS (controlada)
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();

            return {
                status,
                message: typeof response === 'string' ? response : (response as any).message,
                errorCode: this.getErrorCodeFromStatus(status),
            };
        }

        // Si es un error no controlado (del sistema, base de datos, etc.)
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            errorCode: 'INTERNAL_SERVER_ERROR',
        };
    }

    private getErrorCodeFromStatus(status: number): string {
        // Mapeamos códigos HTTP a códigos internos más descriptivos
        const statusToErrorCode: Record<number, string> = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'VALIDATION_ERROR',
            429: 'TOO_MANY_REQUESTS',
            500: 'INTERNAL_SERVER_ERROR',
        };

        return statusToErrorCode[status] || 'UNKNOWN_ERROR';
    }

    private logError(exception: unknown, request: Request, status: number): void {
        const message = `${request.method} ${request.url}`;

        // Errores 5xx son errores del servidor (más graves)
        if (status >= 500) {
            this.logger.error(
                `${message} - ${status}`,
                exception instanceof Error ? exception.stack : exception,
            );
        }
        // Errores 4xx son errores del cliente (menos graves)
        else if (status >= 400) {
            this.logger.warn(`${message} - ${status} - ${exception}`);
        }
    }
}