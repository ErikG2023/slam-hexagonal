import { Logger } from '@nestjs/common';
import { UsuarioDominioService, ResultadoEliminacion } from '../../dominio/servicios/usuario-dominio.service';

export class UsuarioEliminadoDto {
    id: number;
    username: string;
    nombreCompleto: string;
    eliminadoPor: number;
    fechaEliminacion: string;
    mensaje: string;

    constructor(resultado: ResultadoEliminacion) {
        this.id = resultado.id;
        this.username = resultado.username;
        this.nombreCompleto = resultado.nombreCompleto;
        this.eliminadoPor = resultado.eliminadoPor;
        this.fechaEliminacion = resultado.fechaEliminacion.toISOString();
        this.mensaje = `El usuario "${resultado.username}" (${resultado.nombreCompleto}) ha sido eliminado exitosamente`;
    }
}

export class EliminarUsuarioCasoUso {
    private readonly logger = new Logger(EliminarUsuarioCasoUso.name);

    constructor(
        private readonly usuarioDominioService: UsuarioDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<UsuarioEliminadoDto> {
        try {
            this.logger.log(
                `Iniciando eliminación (soft delete) de usuario ID ${id}`,
                {
                    auditoria: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        operacion: 'ELIMINAR_USUARIO'
                    }
                }
            );

            const resultadoEliminacion = await this.usuarioDominioService.eliminarUsuario(id, idUsuarioEjecutor);

            this.logger.log(
                `Usuario eliminado exitosamente: ID ${resultadoEliminacion.id}, username: "${resultadoEliminacion.username}"`,
                {
                    resultado: {
                        idUsuario: resultadoEliminacion.id,
                        usernameUsuario: resultadoEliminacion.username,
                        nombreCompleto: resultadoEliminacion.nombreCompleto,
                        estadoFinal: 'ELIMINADO',
                        eliminadoPor: resultadoEliminacion.eliminadoPor,
                        tipoEliminacion: 'SOFT_DELETE',
                        fechaEliminacion: resultadoEliminacion.fechaEliminacion.toISOString()
                    }
                }
            );

            return new UsuarioEliminadoDto(resultadoEliminacion);

        } catch (error) {
            this.logger.error(
                `Error crítico al eliminar usuario ID ${id}: ${error.message}`,
                {
                    contextoError: {
                        idUsuario: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        momentoFallo: new Date().toISOString(),
                        operacionFallida: 'ELIMINAR_USUARIO'
                    }
                }
            );
            throw error;
        }
    }
}