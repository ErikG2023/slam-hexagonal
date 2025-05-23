import { Logger } from '@nestjs/common';
import { PermisoDominioService } from '../../dominio/servicios/permiso-dominio.service';
import { ActualizarPermisoDto } from '../dtos/actualizar-permiso.dto';
import { PermisoRespuestaDto } from '../dtos/permiso-respuesta.dto';

export class ActualizarPermisoCasoUso {
    private readonly logger = new Logger(ActualizarPermisoCasoUso.name);

    constructor(
        private readonly permisoDominioService: PermisoDominioService
    ) { }

    async ejecutar(
        id: number,
        datos: ActualizarPermisoDto,
        idUsuarioEjecutor: number
    ): Promise<PermisoRespuestaDto> {
        try {
            const camposAActualizar = Object.keys(datos).filter(key => datos[key] !== undefined);
            this.logger.log(
                `Iniciando actualización de permiso ID ${id} por usuario ${idUsuarioEjecutor}`,
                { camposAActualizar }
            );

            const permisoActualizado = await this.permisoDominioService.actualizarPermiso(id, {
                nombre: datos.nombre,
                codigo: datos.codigo,
                descripcion: datos.descripcion,
                idUsuarioModificacion: idUsuarioEjecutor
            });

            this.logger.log(
                `Permiso actualizado exitosamente: ID ${id}`,
                {
                    nombreAnterior: datos.nombre ? 'actualizado' : 'sin cambios',
                    codigoAnterior: datos.codigo ? 'actualizado' : 'sin cambios',
                    descripcionAnterior: datos.descripcion !== undefined ? 'actualizada' : 'sin cambios'
                }
            );

            return new PermisoRespuestaDto(permisoActualizado);

        } catch (error) {
            this.logger.error(
                `Error al actualizar permiso ID ${id}: ${error.message}`,
                {
                    datosEntrada: {
                        camposEnviados: Object.keys(datos),
                        idPermiso: id
                    },
                    idUsuarioEjecutor,
                    tipoError: error.constructor.name
                }
            );
            throw error;
        }
    }
}