import { Logger } from '@nestjs/common';
import { PermisoDominioService, ResultadoEliminacion } from '../../dominio/servicios/permiso-dominio.service';

export class PermisoEliminadoDto {
    id: number;
    nombre: string;
    codigo: string;
    eliminadoPor: number;
    fechaEliminacion: string;
    mensaje: string;

    constructor(resultado: ResultadoEliminacion) {
        this.id = resultado.id;
        this.nombre = resultado.nombre;
        this.codigo = resultado.codigo;
        this.eliminadoPor = resultado.eliminadoPor;
        this.fechaEliminacion = resultado.fechaEliminacion.toISOString();
        this.mensaje = `El permiso "${resultado.codigo}" (${resultado.nombre}) ha sido eliminado exitosamente`;
    }
}

export class EliminarPermisoCasoUso {
    private readonly logger = new Logger(EliminarPermisoCasoUso.name);

    constructor(
        private readonly permisoDominioService: PermisoDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<PermisoEliminadoDto> {
        try {
            this.logger.log(
                `Iniciando eliminación (soft delete) de permiso ID ${id}`,
                {
                    auditoria: {
                        idPermiso: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        operacion: 'ELIMINAR_PERMISO'
                    }
                }
            );

            const resultadoEliminacion = await this.permisoDominioService.eliminarPermiso(id, idUsuarioEjecutor);

            this.logger.log(
                `Permiso eliminado exitosamente: ID ${resultadoEliminacion.id}, código: "${resultadoEliminacion.codigo}", nombre: "${resultadoEliminacion.nombre}"`,
                {
                    resultado: {
                        idPermiso: resultadoEliminacion.id,
                        codigoPermiso: resultadoEliminacion.codigo,
                        nombrePermiso: resultadoEliminacion.nombre,
                        estadoFinal: 'ELIMINADO',
                        eliminadoPor: resultadoEliminacion.eliminadoPor,
                        tipoEliminacion: 'SOFT_DELETE',
                        fechaEliminacion: resultadoEliminacion.fechaEliminacion.toISOString()
                    }
                }
            );

            return new PermisoEliminadoDto(resultadoEliminacion);

        } catch (error) {
            this.logger.error(
                `Error crítico al eliminar permiso ID ${id}: ${error.message}`,
                {
                    contextoError: {
                        idPermiso: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        momentoFallo: new Date().toISOString(),
                        operacionFallida: 'ELIMINAR_PERMISO'
                    }
                }
            );
            throw error;
        }
    }
}