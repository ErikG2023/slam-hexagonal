import { Logger } from '@nestjs/common';
import { UsuarioDominioService } from '../../dominio/servicios/usuario-dominio.service';
import { ActualizarUsuarioDto } from '../dtos/actualizar-usuario.dto';
import { UsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';

export class ActualizarUsuarioCasoUso {
    private readonly logger = new Logger(ActualizarUsuarioCasoUso.name);

    constructor(
        private readonly usuarioDominioService: UsuarioDominioService
    ) { }

    async ejecutar(
        id: number,
        datos: ActualizarUsuarioDto,
        idUsuarioEjecutor: number
    ): Promise<UsuarioRespuestaDto> {
        try {
            const camposAActualizar = Object.keys(datos).filter(key => datos[key] !== undefined);
            this.logger.log(
                `Iniciando actualización de usuario ID ${id} por usuario ${idUsuarioEjecutor}`,
                { camposAActualizar }
            );

            const usuarioActualizado = await this.usuarioDominioService.actualizarUsuario(id, {
                idRol: datos.idRol,
                bloqueado: datos.bloqueado,
                idUsuarioModificacion: idUsuarioEjecutor
            });

            this.logger.log(
                `Usuario actualizado exitosamente: ID ${id}`,
                {
                    rolAnterior: datos.idRol ? 'actualizado' : 'sin cambios',
                    bloqueoAnterior: datos.bloqueado !== undefined ? 'actualizado' : 'sin cambios'
                }
            );

            return new UsuarioRespuestaDto(usuarioActualizado);

        } catch (error) {
            this.logger.error(
                `Error al actualizar usuario ID ${id}: ${error.message}`,
                {
                    datosEntrada: {
                        camposEnviados: Object.keys(datos),
                        idUsuario: id
                    },
                    idUsuarioEjecutor,
                    tipoError: error.constructor.name
                }
            );
            throw error;
        }
    }
}