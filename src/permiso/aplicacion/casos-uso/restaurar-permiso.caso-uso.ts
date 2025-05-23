import { Logger } from '@nestjs/common';
import { PermisoDominioService } from '../../dominio/servicios/permiso-dominio.service';
import { PermisoRespuestaDto } from '../dtos/permiso-respuesta.dto';

export class RestaurarPermisoCasoUso {
    private readonly logger = new Logger(RestaurarPermisoCasoUso.name);

    constructor(
        private readonly permisoDominioService: PermisoDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<PermisoRespuestaDto> {
        try {
            this.logger.log(
                `Iniciando restauración de permiso eliminado: ID ${id}`,
                {
                    operacionRestauracion: {
                        idPermiso: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        razonOperacion: 'RESTAURAR_PERMISO_ELIMINADO'
                    }
                }
            );

            this.logger.debug(
                `Validando condiciones para restauración del permiso ID ${id}`,
                {
                    validaciones: [
                        'existencia_permiso',
                        'estado_eliminado',
                        'conflicto_nombres',
                        'conflicto_codigos'
                    ]
                }
            );

            const permisoRestaurado = await this.permisoDominioService.restaurarPermiso(id, idUsuarioEjecutor);

            this.logger.log(
                `Permiso restaurado exitosamente: ID ${id}, código: "${permisoRestaurado.codigo}", nombre: "${permisoRestaurado.nombre}"`,
                {
                    resultadoRestauracion: {
                        idPermiso: permisoRestaurado.id,
                        codigoPermiso: permisoRestaurado.codigo,
                        nombrePermiso: permisoRestaurado.nombre,
                        restauradoPor: idUsuarioEjecutor,
                        estadoFinal: 'ACTIVO',
                        fechaRestauracion: new Date().toISOString()
                    }
                }
            );

            return new PermisoRespuestaDto(permisoRestaurado);

        } catch (error) {
            this.logger.error(
                `Error al restaurar permiso ID ${id}: ${error.message}`,
                {
                    contextoErrorRestauracion: {
                        idPermiso: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        posiblesCausas: [
                            'permiso_no_existe',
                            'permiso_ya_activo',
                            'conflicto_nombre',
                            'conflicto_codigo',
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