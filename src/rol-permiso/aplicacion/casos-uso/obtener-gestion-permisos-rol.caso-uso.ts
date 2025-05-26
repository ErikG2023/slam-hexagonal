import { Logger } from '@nestjs/common';
import { RolPermisoRepositorio } from '../../dominio/puertos/repositorios/rol-permiso-repositorio.interface';
import { GestionPermisosRolDto } from '../dtos/gestion-permisos-rol.dto';
import { RolNoValidoException } from '../../dominio/excepciones/rol-permiso-domain.exception';

export class ObtenerGestionPermisosRolCasoUso {
    private readonly logger = new Logger(ObtenerGestionPermisosRolCasoUso.name);

    constructor(
        private readonly rolPermisoRepositorio: RolPermisoRepositorio
    ) { }

    async ejecutar(idRol: number): Promise<GestionPermisosRolDto> {
        try {
            this.logger.log(`Cargando gestión de permisos para rol ID ${idRol}`);

            // Validar que el rol existe y está activo
            const rolExiste = await this.rolPermisoRepositorio.rolExisteYEstaActivo(idRol);
            if (!rolExiste) {
                throw new RolNoValidoException(idRol);
            }

            // Obtener todos los datos necesarios para la pantalla
            const gestionPermisos = await this.rolPermisoRepositorio.obtenerGestionPermisosDeRol(idRol);

            this.logger.log(
                `Gestión de permisos cargada para rol "${gestionPermisos.rol.nombre}"`,
                {
                    metricas: {
                        permisosAsignados: gestionPermisos.permisosAsignados.length,
                        permisosDisponibles: gestionPermisos.permisosDisponibles.length,
                        totalPermisos: gestionPermisos.permisosAsignados.length + gestionPermisos.permisosDisponibles.length
                    }
                }
            );

            return new GestionPermisosRolDto(gestionPermisos);

        } catch (error) {
            this.logger.error(
                `Error al cargar gestión de permisos para rol ID ${idRol}: ${error.message}`,
                {
                    contextoError: {
                        idRol,
                        tipoError: error.constructor.name,
                        operacion: 'CARGAR_GESTION_PERMISOS'
                    }
                }
            );
            throw error;
        }
    }
}