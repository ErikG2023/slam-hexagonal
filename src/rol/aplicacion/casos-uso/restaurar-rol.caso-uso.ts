import { Logger } from '@nestjs/common';
import { RolDominioService } from '../../dominio/servicios/rol-dominio.service';
import { RolRespuestaDto } from '../dtos/rol-respuesta.dto';

export class RestaurarRolCasoUso {
    private readonly logger = new Logger(RestaurarRolCasoUso.name);

    constructor(
        private readonly rolDominioService: RolDominioService
    ) { }

    async ejecutar(id: number, idUsuarioEjecutor: number): Promise<RolRespuestaDto> {
        try {
            // La restauración es una operación especial que merece logging detallado
            // Nos ayuda a entender patrones: ¿se eliminan roles por error frecuentemente?
            // ¿Hay usuarios específicos que restauran más que otros?
            this.logger.log(
                `Iniciando restauración de rol eliminado: ID ${id}`,
                {
                    operacionRestauracion: {
                        idRol: id,
                        idUsuarioEjecutor,
                        timestamp: new Date().toISOString(),
                        razonOperacion: 'RESTAURAR_ROL_ELIMINADO'
                    }
                }
            );

            // Registramos que estamos validando las condiciones para la restauración
            this.logger.debug(
                `Validando condiciones para restauración del rol ID ${id}`,
                {
                    validaciones: [
                        'existencia_rol',
                        'estado_eliminado',
                        'conflicto_nombres'
                    ]
                }
            );

            const rolRestaurado = await this.rolDominioService.restaurarRol(id, idUsuarioEjecutor);

            // Log de éxito con información completa del resultado
            this.logger.log(
                `Rol restaurado exitosamente: ID ${id}, nombre: "${rolRestaurado.nombre}"`,
                {
                    resultadoRestauracion: {
                        idRol: rolRestaurado.id,
                        nombreRol: rolRestaurado.nombre,
                        restauradoPor: idUsuarioEjecutor,
                        estadoFinal: 'ACTIVO',
                        fechaRestauracion: new Date().toISOString()
                    }
                }
            );

            return new RolRespuestaDto(rolRestaurado);

        } catch (error) {
            // Los errores en restauración pueden indicar problemas de datos o conflictos
            // Es importante capturar esta información para análisis posterior
            this.logger.error(
                `Error al restaurar rol ID ${id}: ${error.message}`,
                {
                    contextoErrorRestauracion: {
                        idRol: id,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        posiblesCausas: [
                            'rol_no_existe',
                            'rol_ya_activo',
                            'conflicto_nombre',
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