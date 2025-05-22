import { Logger } from '@nestjs/common';
import { RolDominioService, ResultadoEliminacion } from '../../dominio/servicios/rol-dominio.service';

export class RolEliminadoDto {
    id: number;
    nombre: string;
    eliminadoPor: number;
    fechaEliminacion: string;
    mensaje: string;

    constructor(resultado: ResultadoEliminacion) {
        this.id = resultado.id;
        this.nombre = resultado.nombre;
        this.eliminadoPor = resultado.eliminadoPor;
        this.fechaEliminacion = resultado.fechaEliminacion.toISOString();
        this.mensaje = `El rol "${resultado.nombre}" ha sido eliminado exitosamente`;
    }
}

export class EliminarRolCasoUso {
    private readonly logger = new Logger(EliminarRolCasoUso.name);

    constructor(
        private readonly rolDominioService: RolDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<RolEliminadoDto> {
        try {
            this.logger.log(
                `Iniciando eliminación (soft delete) de rol ID ${id}`,
                {
                    auditoria: {
                        idRol: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        operacion: 'ELIMINAR_ROL'
                    }
                }
            );

            // El servicio de dominio ahora nos devuelve información sobre lo eliminado
            const resultadoEliminacion = await this.rolDominioService.eliminarRol(id, idUsuarioEjecutor);

            this.logger.log(
                `Rol eliminado exitosamente: ID ${resultadoEliminacion.id}, nombre: "${resultadoEliminacion.nombre}"`,
                {
                    resultado: {
                        idRol: resultadoEliminacion.id,
                        nombreRol: resultadoEliminacion.nombre,
                        estadoFinal: 'ELIMINADO',
                        eliminadoPor: resultadoEliminacion.eliminadoPor,
                        tipoEliminacion: 'SOFT_DELETE',
                        fechaEliminacion: resultadoEliminacion.fechaEliminacion.toISOString()
                    }
                }
            );

            return new RolEliminadoDto(resultadoEliminacion);

        } catch (error) {
            this.logger.error(
                `Error crítico al eliminar rol ID ${id}: ${error.message}`,
                {
                    contextoError: {
                        idRol: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        momentoFallo: new Date().toISOString(),
                        operacionFallida: 'ELIMINAR_ROL'
                    }
                }
            );
            throw error;
        }
    }
}