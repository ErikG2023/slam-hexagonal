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

@Catch(RolDomainException, PermisoDomainException, RolPermisoDomainException, UsuarioDomainException) // Agregamos UsuarioDomainException
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: RolDomainException | PermisoDomainException | RolPermisoDomainException | UsuarioDomainException, host: ArgumentsHost) {
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

    private getHttpStatusFromDomainException(exception: RolDomainException | PermisoDomainException | RolPermisoDomainException | UsuarioDomainException): number {
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

        // Excepciones de ROL-PERMISO
        if (exception instanceof PermisoYaAsignnadoException) {
            return HttpStatus.CONFLICT;
        }
        if (exception instanceof AsignacionNoEncontradaException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof RolNoValidoException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof PermisoNoValidoException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof RolPermisoDatosInvalidosException) {
            return HttpStatus.BAD_REQUEST;
        }

        // Excepciones de USUARIO
        if (exception instanceof UsuarioUsernameDuplicadoException) {
            return HttpStatus.CONFLICT;
        }
        if (exception instanceof UsuarioNoEncontradoException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof UsuarioInactivoException) {
            return HttpStatus.FORBIDDEN;
        }
        if (exception instanceof UsuarioBloqueadoException) {
            return HttpStatus.FORBIDDEN;
        }
        if (exception instanceof UsuarioConDependenciasException) {
            return HttpStatus.CONFLICT;
        }
        if (exception instanceof PersonaYaTieneUsuarioException) {
            return HttpStatus.CONFLICT;
        }
        if (exception instanceof PersonaNoValidaException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof UsuarioRolNoValidoException) {
            return HttpStatus.NOT_FOUND;
        }
        if (exception instanceof UsuarioDatosInvalidosException) {
            return HttpStatus.BAD_REQUEST;
        }
        if (exception instanceof CredencialesInvalidasException) {
            return HttpStatus.UNAUTHORIZED;
        }

        return HttpStatus.BAD_REQUEST;
    }

    private getErrorCodeFromDomainException(exception: RolDomainException | PermisoDomainException | RolPermisoDomainException | UsuarioDomainException): string {
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

        // Códigos de error para ROL-PERMISO
        if (exception instanceof PermisoYaAsignnadoException) {
            return 'PERMISO_YA_ASIGNADO';
        }
        if (exception instanceof AsignacionNoEncontradaException) {
            return 'ASIGNACION_NO_ENCONTRADA';
        }
        if (exception instanceof RolNoValidoException) {
            return 'ROL_NO_VALIDO';
        }
        if (exception instanceof PermisoNoValidoException) {
            return 'PERMISO_NO_VALIDO';
        }
        if (exception instanceof RolPermisoDatosInvalidosException) {
            return 'ROL_PERMISO_DATOS_INVALIDOS';
        }

        // Códigos de error para USUARIO
        if (exception instanceof UsuarioUsernameDuplicadoException) {
            return 'USUARIO_USERNAME_DUPLICADO';
        }
        if (exception instanceof UsuarioNoEncontradoException) {
            return 'USUARIO_NO_ENCONTRADO';
        }
        if (exception instanceof UsuarioInactivoException) {
            return 'USUARIO_INACTIVO';
        }
        if (exception instanceof UsuarioBloqueadoException) {
            return 'USUARIO_BLOQUEADO';
        }
        if (exception instanceof UsuarioConDependenciasException) {
            return 'USUARIO_CON_DEPENDENCIAS';
        }
        if (exception instanceof PersonaYaTieneUsuarioException) {
            return 'PERSONA_YA_TIENE_USUARIO';
        }
        if (exception instanceof PersonaNoValidaException) {
            return 'PERSONA_NO_VALIDA';
        }
        if (exception instanceof UsuarioRolNoValidoException) {
            return 'USUARIO_ROL_NO_VALIDO';
        }
        if (exception instanceof UsuarioDatosInvalidosException) {
            return 'USUARIO_DATOS_INVALIDOS';
        }
        if (exception instanceof CredencialesInvalidasException) {
            return 'CREDENCIALES_INVALIDAS';
        }

        return 'DOMAIN_ERROR';
    }
}