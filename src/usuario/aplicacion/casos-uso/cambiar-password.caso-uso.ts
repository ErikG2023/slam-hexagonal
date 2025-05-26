import { Logger } from '@nestjs/common';
import { UsuarioDominioService } from '../../dominio/servicios/usuario-dominio.service';
import { CambiarPasswordDto } from '../dtos/cambiar-password.dto';
import { UsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';
import * as bcrypt from 'bcrypt';

export class CambiarPasswordCasoUso {
    private readonly logger = new Logger(CambiarPasswordCasoUso.name);

    constructor(
        private readonly usuarioDominioService: UsuarioDominioService
    ) { }

    async ejecutar(
        id: number,
        datos: CambiarPasswordDto,
        idUsuarioEjecutor: number
    ): Promise<UsuarioRespuestaDto> {
        try {
            this.logger.log(`Iniciando cambio de contraseña para usuario ID ${id} por usuario ${idUsuarioEjecutor}`);

            // Hashear la nueva contraseña
            const saltRounds = 12;
            const nuevaPasswordHash = await bcrypt.hash(datos.nuevaPassword, saltRounds);

            const usuarioActualizado = await this.usuarioDominioService.cambiarPassword(id, {
                nuevaPasswordHash,
                idUsuarioModificacion: idUsuarioEjecutor
            });

            this.logger.log(`Contraseña cambiada exitosamente para usuario ID ${id}`);

            return new UsuarioRespuestaDto(usuarioActualizado);

        } catch (error) {
            this.logger.error(
                `Error al cambiar contraseña para usuario ID ${id}: ${error.message}`,
                {
                    idUsuario: id,
                    idUsuarioEjecutor,
                    tipoError: error.constructor.name
                }
            );
            throw error;
        }
    }
}