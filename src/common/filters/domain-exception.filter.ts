import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
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

@Catch(RolDomainException, PermisoDomainException) // Captura excepciones de dominio de roles y permisos
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: RolDomainException | PermisoDomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        // Mapeamos cada tipo de excepción de dominio a un código HTTP específico
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

    private getHttpStatusFromDomainException(exception: RolDomainException | PermisoDomainException): number {
        // Excepciones de ROL
        if (exception instanceof RolNombreDuplicadoException) {
            return HttpStatus.CONFLICT;
        }
        if (exception instanceof RolNoEncontradoException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof RolInactivoException) {
            return HttpStatus.FORBIDDEN;
        }
        if (exception instanceof RolConDependenciasException) {
            return HttpStatus.CONFLICT;
        }
        if (exception instanceof RolDatosInvalidosException) {
            return HttpStatus.BAD_REQUEST;
        }

        // Excepciones de PERMISO
        if (exception instanceof PermisoNombreDuplicadoException) {
            return HttpStatus.CONFLICT;
        }
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

        // Para excepciones de dominio no específicas, usamos Bad Request
        return HttpStatus.BAD_REQUEST;
    }

    private getErrorCodeFromDomainException(exception: RolDomainException | PermisoDomainException): string {
        // Códigos de error para ROL
        if (exception instanceof RolNombreDuplicadoException) {
            return 'ROL_NOMBRE_DUPLICADO';
        }
        if (exception instanceof RolNoEncontradoException) {
            return 'ROL_NO_ENCONTRADO';
        }
        if (exception instanceof RolInactivoException) {
            return 'ROL_INACTIVO';
        }
        if (exception instanceof RolConDependenciasException) {
            return 'ROL_CON_DEPENDENCIAS';
        }
        if (exception instanceof RolDatosInvalidosException) {
            return 'ROL_DATOS_INVALIDOS';
        }

        // Códigos de error para PERMISO
        if (exception instanceof PermisoNombreDuplicadoException) {
            return 'PERMISO_NOMBRE_DUPLICADO';
        }
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

        return 'DOMAIN_ERROR';
    }
}