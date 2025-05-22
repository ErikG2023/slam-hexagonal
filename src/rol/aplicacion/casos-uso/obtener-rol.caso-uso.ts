import { Logger } from '@nestjs/common';
import { RolRepositorio } from '../../dominio/puertos/repositorios/rol-repositorio.interface';
import { RolRespuestaDto } from '../dtos/rol-respuesta.dto';

export class ObtenerRolCasoUso {
    private readonly logger = new Logger(ObtenerRolCasoUso.name);

    constructor(
        private readonly rolRepositorio: RolRepositorio
    ) { }

    async ejecutar(id: number): Promise<RolRespuestaDto> {
        try {
            // Para operaciones de lectura simples, usamos 'debug' en lugar de 'log'
            // Esto nos permite tener información detallada en desarrollo pero reducir ruido en producción
            this.logger.debug(`Buscando rol con ID ${id}`);

            const rol = await this.rolRepositorio.buscarPorId(id);

            if (!rol) {
                // Este es un caso esperado de negocio, no un error técnico
                this.logger.warn(`Intento de acceso a rol inexistente: ID ${id}`);
                throw new Error(`No se encontró un rol con ID ${id}`);
            }

            this.logger.debug(`Rol encontrado: ID ${rol.id}, nombre: "${rol.nombre}", activo: ${rol.activo}`);

            return new RolRespuestaDto(rol);

        } catch (error) {
            // Solo logeamos como error si es algo inesperado
            if (error.message.includes('No se encontró')) {
                // Para errores esperados de negocio, usamos 'warn'
                this.logger.warn(`Rol no encontrado: ID ${id}`);
            } else {
                // Para errores técnicos inesperados, usamos 'error'
                this.logger.error(`Error técnico al buscar rol ID ${id}: ${error.message}`);
            }
            throw error;
        }
    }
}