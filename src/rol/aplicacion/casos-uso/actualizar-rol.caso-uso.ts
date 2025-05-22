import { Logger } from '@nestjs/common';
import { RolDominioService } from '../../dominio/servicios/rol-dominio.service';
import { ActualizarRolDto } from '../dtos/actualizar-rol.dto';
import { RolRespuestaDto } from '../dtos/rol-respuesta.dto';

export class ActualizarRolCasoUso {
    private readonly logger = new Logger(ActualizarRolCasoUso.name);

    constructor(
        private readonly rolDominioService: RolDominioService
    ) { }

    async ejecutar(
        id: number,
        datos: ActualizarRolDto,
        idUsuarioEjecutor: number
    ): Promise<RolRespuestaDto> {
        try {
            // Log con información específica sobre qué campos se están actualizando
            const camposAActualizar = Object.keys(datos).filter(key => datos[key] !== undefined);
            this.logger.log(
                `Iniciando actualización de rol ID ${id} por usuario ${idUsuarioEjecutor}`,
                { camposAActualizar } // Contexto estructurado adicional
            );

            const rolActualizado = await this.rolDominioService.actualizarRol(id, {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                idUsuarioModificacion: idUsuarioEjecutor
            });

            this.logger.log(
                `Rol actualizado exitosamente: ID ${id}`,
                {
                    nombreAnterior: datos.nombre ? 'actualizado' : 'sin cambios',
                    descripcionAnterior: datos.descripcion !== undefined ? 'actualizada' : 'sin cambios'
                }
            );

            return new RolRespuestaDto(rolActualizado);

        } catch (error) {
            this.logger.error(
                `Error al actualizar rol ID ${id}: ${error.message}`,
                {
                    datosEntrada: {
                        camposEnviados: Object.keys(datos),
                        idRol: id
                    },
                    idUsuarioEjecutor,
                    tipoError: error.constructor.name
                }
            );
            throw error;
        }
    }
}