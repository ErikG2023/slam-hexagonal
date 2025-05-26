import { Logger } from '@nestjs/common';
import { UsuarioDominioService } from '../../dominio/servicios/usuario-dominio.service';
import { UsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';

export class BloquearUsuarioCasoUso {
    private readonly logger = new Logger(BloquearUsuarioCasoUso.name);

    constructor(
        private readonly usuarioDominioService: UsuarioDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<UsuarioRespuestaDto> {
        try {
            this.logger.log(
                `Iniciando bloqueo de usuario ID ${id} por usuario ${idUsuarioEjecutor}`,
                {
                    operacionBloqueo: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        razonOperacion: 'BLOQUEAR_USUARIO'
                    }
                }
            );

            const usuarioBloqueado = await this.usuarioDominioService.bloquearUsuario(id, idUsuarioEjecutor);

            this.logger.log(
                `Usuario bloqueado exitosamente: ID ${id}, username: "${usuarioBloqueado.username}"`,
                {
                    resultadoBloqueo: {
                        idUsuario: usuarioBloqueado.id,
                        usernameUsuario: usuarioBloqueado.username,
                        bloqueadoPor: idUsuarioEjecutor,
                        estadoFinal: 'BLOQUEADO',
                        fechaBloqueo: new Date().toISOString()
                    }
                }
            );

            return new UsuarioRespuestaDto(usuarioBloqueado);

        } catch (error) {
            this.logger.error(
                `Error al bloquear usuario ID ${id}: ${error.message}`,
                {
                    contextoError: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        operacionFallida: 'BLOQUEAR_USUARIO'
                    }
                }
            );
            throw error;
        }
    }
}