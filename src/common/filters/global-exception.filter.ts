import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
    RolDomainException,
    RolNombreDuplicadoException,
    RolNoEncontradoException,
    RolInactivoException,
    RolConDependenciasException,
    RolDatosInvalidosException
} from '../../rol/dominio/excepciones/rol-domain.exception';
import {
    PermisoDomainException,
    PermisoNombreDuplicadoException,
    PermisoCodigoDuplicadoException,
    PermisoNoEncontradoException,
    PermisoInactivoException,
    PermisoConDependenciasException,
    PermisoDatosInvalidosException
} from '../../permiso/dominio/excepciones/permiso-domain.exception';

@Catch() // Captura TODAS las excepciones, pero las maneja inteligentemente
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Aquí está la magia: determinamos el tipo de excepción y la manejamos apropiadamente
        const { status, message, errorCode } = this.determineErrorResponse(exception);

        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            errorCode,
        };

        // Logeamos con diferente nivel según el tipo de error
        this.logError(exception, request, status);

        response.status(status).json(errorResponse);
    }

    private determineErrorResponse(exception: unknown): {
        status: number;
        message: string;
        errorCode: string;
    } {
        // PASO 1: Verificamos si es una excepción de dominio (errores de negocio)
        if (this.isDomainException(exception)) {
            return this.handleDomainException(exception as RolDomainException | PermisoDomainException);
        }

        // PASO 2: Verificamos si es una HttpException de NestJS (errores controlados)
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();

            return {
                status,
                message: typeof response === 'string' ? response : (response as any).message || exception.message,
                errorCode: this.getErrorCodeFromHttpStatus(status),
            };
        }

        // PASO 3: Para todo lo demás, es un error interno del servidor
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            errorCode: 'INTERNAL_SERVER_ERROR',
        };
    }

    // Método que verifica si una excepción es de dominio
    private isDomainException(exception: unknown): boolean {
        return exception instanceof RolDomainException ||
            exception instanceof PermisoDomainException ||
            (exception instanceof Error && exception.constructor.name.includes('DomainException'));
    }

    // Método especializado para manejar excepciones de dominio
    private handleDomainException(exception: RolDomainException | PermisoDomainException): {
        status: number;
        message: string;
        errorCode: string;
    } {
        // Excepciones de ROL
        if (exception instanceof RolNombreDuplicadoException) {
            return {
                status: HttpStatus.CONFLICT,
                message: exception.message,
                errorCode: 'ROL_NOMBRE_DUPLICADO',
            };
        }
        if (exception instanceof RolNoEncontradoException) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: exception.message,
                errorCode: 'ROL_NO_ENCONTRADO',
            };
        }
        if (exception instanceof RolInactivoException) {
            return {
                status: HttpStatus.FORBIDDEN,
                message: exception.message,
                errorCode: 'ROL_INACTIVO',
            };
        }
        if (exception instanceof RolConDependenciasException) {
            return {
                status: HttpStatus.CONFLICT,
                message: exception.message,
                errorCode: 'ROL_CON_DEPENDENCIAS',
            };
        }
        if (exception instanceof RolDatosInvalidosException) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: exception.message,
                errorCode: 'ROL_DATOS_INVALIDOS',
            };
        }

        // Excepciones de PERMISO
        if (exception instanceof PermisoNombreDuplicadoException) {
            return {
                status: HttpStatus.CONFLICT,
                message: exception.message,
                errorCode: 'PERMISO_NOMBRE_DUPLICADO',
            };
        }
        if (exception instanceof PermisoCodigoDuplicadoException) {
            return {
                status: HttpStatus.CONFLICT,
                message: exception.message,
                errorCode: 'PERMISO_CODIGO_DUPLICADO',
            };
        }
        if (exception instanceof PermisoNoEncontradoException) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: exception.message,
                errorCode: 'PERMISO_NO_ENCONTRADO',
            };
        }
        if (exception instanceof PermisoInactivoException) {
            return {
                status: HttpStatus.FORBIDDEN,
                message: exception.message,
                errorCode: 'PERMISO_INACTIVO',
            };
        }
        if (exception instanceof PermisoConDependenciasException) {
            return {
                status: HttpStatus.CONFLICT,
                message: exception.message,
                errorCode: 'PERMISO_CON_DEPENDENCIAS',
            };
        }
        if (exception instanceof PermisoDatosInvalidosException) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: exception.message,
                errorCode: 'PERMISO_DATOS_INVALIDOS',
            };
        }

        // Fallback para excepciones de dominio no específicas
        return {
            status: HttpStatus.BAD_REQUEST,
            message: exception.message,
            errorCode: 'DOMAIN_ERROR',
        };
    }

    private getErrorCodeFromHttpStatus(status: number): string {
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

        // Los errores de dominio (4xx) son menos críticos que los errores técnicos (5xx)
        if (status >= 500) {
            this.logger.error(
                `${message} - ${status}`,
                exception instanceof Error ? exception.stack : exception,
            );
        } else if (status >= 400) {
            this.logger.warn(`${message} - ${status} - ${exception}`);
        }
    }
}