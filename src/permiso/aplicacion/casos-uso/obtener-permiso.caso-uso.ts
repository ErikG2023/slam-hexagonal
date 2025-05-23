import { Logger } from '@nestjs/common';
import { PermisoRepositorio } from '../../dominio/puertos/repositorios/permiso-repositorio.interface';
import { PermisoRespuestaDto } from '../dtos/permiso-respuesta.dto';

export class ObtenerPermisoCasoUso {
    private readonly logger = new Logger(ObtenerPermisoCasoUso.name);

    constructor(
        private readonly permisoRepositorio: PermisoRepositorio
    ) { }

    async ejecutar(id: number): Promise<PermisoRespuestaDto> {
        try {
            this.logger.debug(`Buscando permiso con ID ${id}`);

            const permiso = await this.permisoRepositorio.buscarPorId(id);

            if (!permiso) {
                this.logger.warn(`Intento de acceso a permiso inexistente: ID ${id}`);
                throw new Error(`No se encontró un permiso con ID ${id}`);
            }

            this.logger.debug(`Permiso encontrado: ID ${permiso.id}, código: "${permiso.codigo}", nombre: "${permiso.nombre}", activo: ${permiso.activo}`);

            return new PermisoRespuestaDto(permiso);

        } catch (error) {
            if (error.message.includes('No se encontró')) {
                this.logger.warn(`Permiso no encontrado: ID ${id}`);
            } else {
                this.logger.error(`Error técnico al buscar permiso ID ${id}: ${error.message}`);
            }
            throw error;
        }
    }
}