import { Logger } from '@nestjs/common';
import { UsuarioDominioService } from '../../dominio/servicios/usuario-dominio.service';
import { UsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';

export class DesbloquearUsuarioCasoUso {
    private readonly logger = new Logger(DesbloquearUsuarioCasoUso.name);

    constructor(
        private readonly usuarioDominioService: UsuarioDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<UsuarioRespuestaDto> {
        try {
            this.logger.log(
                `Iniciando desbloqueo de usuario ID ${id} por usuario ${idUsuarioEjecutor}`,
                {
                    operacionDesbloqueo: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        razonOperacion: 'DESBLOQUEAR_USUARIO'
                    }
                }
            );

            const usuarioDesbloqueado = await this.usuarioDominioService.desbloquearUsuario(id, idUsuarioEjecutor);

            this.logger.log(
                `Usuario desbloqueado exitosamente: ID ${id}, username: "${usuarioDesbloqueado.username}"`,
                {
                    resultadoDesbloqueo: {
                        idUsuario: usuarioDesbloqueado.id,
                        usernameUsuario: usuarioDesbloqueado.username,
                        desbloqueadoPor: idUsuarioEjecutor,
                        estadoFinal: 'ACTIVO_NO_BLOQUEADO',
                        fechaDesbloqueo: new Date().toISOString()
                    }
                }
            );

            return new UsuarioRespuestaDto(usuarioDesbloqueado);

        } catch (error) {
            this.logger.error(
                `Error al desbloquear usuario ID ${id}: ${error.message}`,
                {
                    contextoError: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        operacionFallida: 'DESBLOQUEAR_USUARIO'
                    }
                }
            );
            throw error;
        }
    }
}