import { Logger } from '@nestjs/common';
import { PermisoDominioService } from '../../dominio/servicios/permiso-dominio.service';
import { CrearPermisoDto } from '../dtos/crear-permiso.dto';
import { PermisoRespuestaDto } from '../dtos/permiso-respuesta.dto';

export class CrearPermisoCasoUso {
    private readonly logger = new Logger(CrearPermisoCasoUso.name);

    constructor(
        private readonly permisoDominioService: PermisoDominioService
    ) { }

    async ejecutar(datos: CrearPermisoDto, idUsuarioEjecutor: number): Promise<PermisoRespuestaDto> {
        try {
            this.logger.log(`Iniciando creación de permiso: código "${datos.codigo}", nombre "${datos.nombre}" por usuario ${idUsuarioEjecutor}`);

            const permisoCreado = await this.permisoDominioService.crearPermiso({
                nombre: datos.nombre,
                codigo: datos.codigo,
                descripcion: datos.descripcion,
                idUsuarioCreacion: idUsuarioEjecutor
            });

            this.logger.log(`Permiso creado exitosamente: ID ${permisoCreado.id}, código: "${permisoCreado.codigo}", nombre: "${permisoCreado.nombre}"`);

            return new PermisoRespuestaDto(permisoCreado);

        } catch (error) {
            this.logger.error(
                `Error al crear permiso: ${error.message}`,
                {
                    datosEntrada: {
                        codigo: datos.codigo,
                        nombre: datos.nombre,
                        tieneDescripcion: !!datos.descripcion
                    },
                    idUsuarioEjecutor,
                    tipoError: error.constructor.name,
                }
            );
            throw error;
        }
    }
}