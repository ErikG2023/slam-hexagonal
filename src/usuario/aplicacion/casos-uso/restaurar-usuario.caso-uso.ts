import { Logger } from '@nestjs/common';
import { UsuarioDominioService } from '../../dominio/servicios/usuario-dominio.service';
import { UsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';

export class RestaurarUsuarioCasoUso {
    private readonly logger = new Logger(RestaurarUsuarioCasoUso.name);

    constructor(
        private readonly usuarioDominioService: UsuarioDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<UsuarioRespuestaDto> {
        try {
            this.logger.log(
                `Iniciando restauración de usuario eliminado: ID ${id}`,
                {
                    operacionRestauracion: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        razonOperacion: 'RESTAURAR_USUARIO_ELIMINADO'
                    }
                }
            );

            this.logger.debug(
                `Validando condiciones para restauración del usuario ID ${id}`,
                {
                    validaciones: [
                        'existencia_usuario',
                        'estado_eliminado',
                        'conflicto_username',
                        'conflicto_persona'
                    ]
                }
            );

            const usuarioRestaurado = await this.usuarioDominioService.restaurarUsuario(id, idUsuarioEjecutor);

            this.logger.log(
                `Usuario restaurado exitosamente: ID ${id}, username: "${usuarioRestaurado.username}"`,
                {
                    resultadoRestauracion: {
                        idUsuario: usuarioRestaurado.id,
                        usernameUsuario: usuarioRestaurado.username,
                        restauradoPor: idUsuarioEjecutor,
                        estadoFinal: 'ACTIVO',
                        fechaRestauracion: new Date().toISOString()
                    }
                }
            );

            return new UsuarioRespuestaDto(usuarioRestaurado);

        } catch (error) {
            this.logger.error(
                `Error al restaurar usuario ID ${id}: ${error.message}`,
                {
                    contextoErrorRestauracion: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        posiblesCausas: [
                            'usuario_no_existe',
                            'usuario_ya_activo',
                            'conflicto_username',
                            'conflicto_persona',
                            'error_validacion'
                        ],
                        momentoError: new Date().toISOString()
                    }
                }
            );
            throw error;
        }
    }
}