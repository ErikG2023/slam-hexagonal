import { Logger } from '@nestjs/common';
import { UsuarioRepositorio } from '../../dominio/puertos/repositorios/usuario-repositorio.interface';
import { UsuarioConDetallesDto } from '../dtos/usuario-con-detalles.dto';

export class ObtenerUsuarioCasoUso {
    private readonly logger = new Logger(ObtenerUsuarioCasoUso.name);

    constructor(
        private readonly usuarioRepositorio: UsuarioRepositorio
    ) { }

    async ejecutar(id: number): Promise<UsuarioConDetallesDto> {
        try {
            this.logger.debug(`Buscando usuario con ID ${id}`);

            const usuario = await this.usuarioRepositorio.buscarConDetalles(id);

            if (!usuario) {
                this.logger.warn(`Intento de acceso a usuario inexistente: ID ${id}`);
                throw new Error(`No se encontró un usuario con ID ${id}`);
            }

            this.logger.debug(`Usuario encontrado: ID ${usuario.id}, username: "${usuario.username}", activo: ${usuario.activo}`);

            return new UsuarioConDetallesDto(usuario);

        } catch (error) {
            if (error.message.includes('No se encontró')) {
                this.logger.warn(`Usuario no encontrado: ID ${id}`);
            } else {
                this.logger.error(`Error técnico al buscar usuario ID ${id}: ${error.message}`);
            }
            throw error;
        }
    }
}