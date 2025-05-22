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

@Catch(RolDomainException) // Solo captura excepciones de dominio de roles
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: RolDomainException, host: ArgumentsHost) {
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
            message: exception.message, // Usamos el mensaje específico de la excepción
            errorCode,
        };

        response.status(statusCode).json(errorResponse);
    }

    private getHttpStatusFromDomainException(exception: RolDomainException): number {
        // Cada tipo de excepción de dominio se mapea a un código HTTP específico
        if (exception instanceof RolNombreDuplicadoException) {
            return HttpStatus.CONFLICT; // 409 - Ya existe un recurso con esos datos
        }

        if (exception instanceof RolNoEncontradoException) {
            return HttpStatus.NOT_FOUND; // 404 - El recurso no existe
        }

        if (exception instanceof RolInactivoException) {
            return HttpStatus.FORBIDDEN; // 403 - El recurso existe pero no se puede operar
        }

        if (exception instanceof RolConDependenciasException) {
            return HttpStatus.CONFLICT; // 409 - No se puede eliminar por dependencias
        }

        if (exception instanceof RolDatosInvalidosException) {
            return HttpStatus.BAD_REQUEST; // 400 - Los datos enviados son incorrectos
        }

        // Para excepciones de dominio no específicas, usamos Bad Request
        return HttpStatus.BAD_REQUEST;
    }

    private getErrorCodeFromDomainException(exception: RolDomainException): string {
        // Códigos de error más específicos para que los clientes puedan reaccionar apropiadamente
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

        return 'ROL_ERROR_DOMINIO';
    }
}