import { Logger } from '@nestjs/common';
import { UsuarioDominioService } from '../../dominio/servicios/usuario-dominio.service';
import { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import { UsuarioRespuestaDto } from '../dtos/usuario-respuesta.dto';
import * as bcrypt from 'bcrypt';

export class CrearUsuarioCasoUso {
    private readonly logger = new Logger(CrearUsuarioCasoUso.name);

    constructor(
        private readonly usuarioDominioService: UsuarioDominioService
    ) { }

    async ejecutar(datos: CrearUsuarioDto, idUsuarioEjecutor: number): Promise<UsuarioRespuestaDto> {
        try {
            this.logger.log(`Iniciando creación de usuario: "${datos.username}" para persona ID ${datos.idPersona} por usuario ${idUsuarioEjecutor}`);

            // Hashear la contraseña antes de enviar al dominio
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(datos.password, saltRounds);

            const usuarioCreado = await this.usuarioDominioService.crearUsuario({
                idPersona: datos.idPersona,
                idRol: datos.idRol,
                username: datos.username,
                passwordHash,
                idUsuarioCreacion: idUsuarioEjecutor
            });

            this.logger.log(`Usuario creado exitosamente: ID ${usuarioCreado.id}, username: "${usuarioCreado.username}"`);

            return new UsuarioRespuestaDto(usuarioCreado);

        } catch (error) {
            this.logger.error(
                `Error al crear usuario: ${error.message}`,
                {
                    datosEntrada: {
                        username: datos.username,
                        idPersona: datos.idPersona,
                        idRol: datos.idRol
                    },
                    idUsuarioEjecutor,
                    tipoError: error.constructor.name,
                }
            );
            throw error;
        }
    }
}