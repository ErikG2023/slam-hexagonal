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
import {
    RolPermisoDomainException,
    PermisoYaAsignnadoException,
    AsignacionNoEncontradaException,
    RolNoValidoException,
    PermisoNoValidoException,
    RolPermisoDatosInvalidosException
} from '../../rol-permiso/dominio/excepciones/rol-permiso-domain.exception';
import {
    UsuarioDomainException,
    UsuarioUsernameDuplicadoException,
    UsuarioNoEncontradoException,
    UsuarioInactivoException,
    UsuarioBloqueadoException,
    UsuarioConDependenciasException,
    PersonaYaTieneUsuarioException,
    PersonaNoValidaException,
    RolNoValidoException as UsuarioRolNoValidoException,
    UsuarioDatosInvalidosException,
    CredencialesInvalidasException
} from '../../usuario/dominio/excepciones/usuario-domain.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

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

        this.logError(exception, request, status);
        response.status(status).json(errorResponse);
    }

    private determineErrorResponse(exception: unknown): {
        status: number;
        message: string;
        errorCode: string;
    } {
        if (this.isDomainException(exception)) {
            return this.handleDomainException(exception as RolDomainException | PermisoDomainException | RolPermisoDomainException | UsuarioDomainException);
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();

            return {
                status,
                message: typeof response === 'string' ? response : (response as any).message || exception.message,
                errorCode: this.getErrorCodeFromHttpStatus(status),
            };
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            errorCode: 'INTERNAL_SERVER_ERROR',
        };
    }

    private isDomainException(exception: unknown): boolean {
        return exception instanceof RolDomainException ||
            exception instanceof PermisoDomainException ||
            exception instanceof RolPermisoDomainException ||
            exception instanceof UsuarioDomainException ||
            (exception instanceof Error && exception.constructor.name.includes('DomainException'));
    }

    private handleDomainException(exception: RolDomainException | PermisoDomainException | RolPermisoDomainException | UsuarioDomainException): {
        status: number;
        message: string;
        errorCode: string;
    } {
        // Excepciones de ROL (mantener código existente)
        if (exception instanceof RolNombreDuplicadoException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'ROL_NOMBRE_DUPLICADO' };
        }
        if (exception instanceof RolNoEncontradoException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'ROL_NO_ENCONTRADO' };
        }
        if (exception instanceof RolInactivoException) {
            return { status: HttpStatus.FORBIDDEN, message: exception.message, errorCode: 'ROL_INACTIVO' };
        }
        if (exception instanceof RolConDependenciasException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'ROL_CON_DEPENDENCIAS' };
        }
        if (exception instanceof RolDatosInvalidosException) {
            return { status: HttpStatus.BAD_REQUEST, message: exception.message, errorCode: 'ROL_DATOS_INVALIDOS' };
        }

        // Excepciones de PERMISO (mantener código existente)
        if (exception instanceof PermisoNombreDuplicadoException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'PERMISO_NOMBRE_DUPLICADO' };
        }
        if (exception instanceof PermisoCodigoDuplicadoException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'PERMISO_CODIGO_DUPLICADO' };
        }
        if (exception instanceof PermisoNoEncontradoException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'PERMISO_NO_ENCONTRADO' };
        }
        if (exception instanceof PermisoInactivoException) {
            return { status: HttpStatus.FORBIDDEN, message: exception.message, errorCode: 'PERMISO_INACTIVO' };
        }
        if (exception instanceof PermisoConDependenciasException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'PERMISO_CON_DEPENDENCIAS' };
        }
        if (exception instanceof PermisoDatosInvalidosException) {
            return { status: HttpStatus.BAD_REQUEST, message: exception.message, errorCode: 'PERMISO_DATOS_INVALIDOS' };
        }

        // Excepciones de ROL-PERMISO (mantener código existente)
        if (exception instanceof PermisoYaAsignnadoException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'PERMISO_YA_ASIGNADO' };
        }
        if (exception instanceof AsignacionNoEncontradaException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'ASIGNACION_NO_ENCONTRADA' };
        }
        if (exception instanceof RolNoValidoException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'ROL_NO_VALIDO' };
        }
        if (exception instanceof PermisoNoValidoException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'PERMISO_NO_VALIDO' };
        }
        if (exception instanceof RolPermisoDatosInvalidosException) {
            return { status: HttpStatus.BAD_REQUEST, message: exception.message, errorCode: 'ROL_PERMISO_DATOS_INVALIDOS' };
        }

        // Excepciones de USUARIO (NUEVAS)
        if (exception instanceof UsuarioUsernameDuplicadoException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'USUARIO_USERNAME_DUPLICADO' };
        }
        if (exception instanceof UsuarioNoEncontradoException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'USUARIO_NO_ENCONTRADO' };
        }
        if (exception instanceof UsuarioInactivoException) {
            return { status: HttpStatus.FORBIDDEN, message: exception.message, errorCode: 'USUARIO_INACTIVO' };
        }
        if (exception instanceof UsuarioBloqueadoException) {
            return { status: HttpStatus.FORBIDDEN, message: exception.message, errorCode: 'USUARIO_BLOQUEADO' };
        }
        if (exception instanceof UsuarioConDependenciasException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'USUARIO_CON_DEPENDENCIAS' };
        }
        if (exception instanceof PersonaYaTieneUsuarioException) {
            return { status: HttpStatus.CONFLICT, message: exception.message, errorCode: 'PERSONA_YA_TIENE_USUARIO' };
        }
        if (exception instanceof PersonaNoValidaException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'PERSONA_NO_VALIDA' };
        }
        if (exception instanceof UsuarioRolNoValidoException) {
            return { status: HttpStatus.NOT_FOUND, message: exception.message, errorCode: 'USUARIO_ROL_NO_VALIDO' };
        }
        if (exception instanceof UsuarioDatosInvalidosException) {
            return { status: HttpStatus.BAD_REQUEST, message: exception.message, errorCode: 'USUARIO_DATOS_INVALIDOS' };
        }
        if (exception instanceof CredencialesInvalidasException) {
            return { status: HttpStatus.UNAUTHORIZED, message: exception.message, errorCode: 'CREDENCIALES_INVALIDAS' };
        }

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