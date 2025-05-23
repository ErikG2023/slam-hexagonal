import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
    PermisoDomainException,
    PermisoCodigoDuplicadoException,
    PermisoNoEncontradoException,
    PermisoInactivoException,
    PermisoConDependenciasException,
    PermisoDatosInvalidosException
} from '../../permiso/dominio/excepciones/permiso-domain.exception';

@Catch(PermisoDomainException)
export class PermisoDomainExceptionFilter implements ExceptionFilter {
    catch(exception: PermisoDomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const statusCode = this.getHttpStatusFromDomainException(exception);
        const errorCode = this.getErrorCodeFromDomainException(exception);

        const errorResponse = {
            success: false,
            statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message,
            errorCode,
        };

        response.status(statusCode).json(errorResponse);
    }

    private getHttpStatusFromDomainException(exception: PermisoDomainException): number {
        if (exception instanceof PermisoCodigoDuplicadoException) {
            return HttpStatus.CONFLICT;
        }

        if (exception instanceof PermisoNoEncontradoException) {
            return HttpStatus.NOT_FOUND;
        }

        if (exception instanceof PermisoInactivoException) {
            return HttpStatus.FORBIDDEN;
        }

        if (exception instanceof PermisoConDependenciasException) {
            return HttpStatus.CONFLICT;
        }

        if (exception instanceof PermisoDatosInvalidosException) {
            return HttpStatus.BAD_REQUEST;
        }

        return HttpStatus.BAD_REQUEST;
    }

    private getErrorCodeFromDomainException(exception: PermisoDomainException): string {
        if (exception instanceof PermisoCodigoDuplicadoException) {
            return 'PERMISO_CODIGO_DUPLICADO';
        }

        if (exception instanceof PermisoNoEncontradoException) {
            return 'PERMISO_NO_ENCONTRADO';
        }

        if (exception instanceof PermisoInactivoException) {
            return 'PERMISO_INACTIVO';
        }

        if (exception instanceof PermisoConDependenciasException) {
            return 'PERMISO_CON_DEPENDENCIAS';
        }

        if (exception instanceof PermisoDatosInvalidosException) {
            return 'PERMISO_DATOS_INVALIDOS';
        }

        return 'PERMISO_ERROR_DOMINIO';
    }
}
