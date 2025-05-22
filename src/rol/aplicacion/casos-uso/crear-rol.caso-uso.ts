import { Logger } from '@nestjs/common';
import { RolDominioService } from '../../dominio/servicios/rol-dominio.service';
import { CrearRolDto } from '../dtos/crear-rol.dto';
import { RolRespuestaDto } from '../dtos/rol-respuesta.dto';

export class CrearRolCasoUso {
    // Creamos una instancia de logger específica para este caso de uso
    // El nombre de la clase se usa como contexto, lo que nos ayuda a identificar de dónde vienen los logs
    private readonly logger = new Logger(CrearRolCasoUso.name);

    constructor(
        private readonly rolDominioService: RolDominioService
    ) { }

    async ejecutar(datos: CrearRolDto, idUsuarioEjecutor: number): Promise<RolRespuestaDto> {
        try {
            // Log de inicio con nivel 'log' (información general)
            // Incluimos contexto relevante pero sin datos sensibles
            this.logger.log(`Iniciando creación de rol: "${datos.nombre}" por usuario ${idUsuarioEjecutor}`);

            const rolCreado = await this.rolDominioService.crearRol({
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                idUsuarioCreacion: idUsuarioEjecutor
            });

            // Log de éxito con información que ayuda a la trazabilidad
            this.logger.log(`Rol creado exitosamente: ID ${rolCreado.id}, nombre: "${rolCreado.nombre}"`);

            return new RolRespuestaDto(rolCreado);

        } catch (error) {
            // Log de error con contexto completo para debugging
            // Usamos 'error' como nivel para que sea fácil filtrar problemas
            this.logger.error(
                `Error al crear rol: ${error.message}`, // Mensaje principal del error
                {
                    // Contexto estructurado que ayuda en el debugging
                    datosEntrada: {
                        nombre: datos.nombre,
                        tieneDescripcion: !!datos.descripcion
                    }, // No logeamos la descripción completa por privacidad
                    idUsuarioEjecutor,
                    tipoError: error.constructor.name, // Nos ayuda a identificar el tipo de error
                }
            );

            // Re-lanzamos el error para que sea manejado por nuestro filtro global
            throw error;
        }
    }
}