import { Logger } from '@nestjs/common';
import { RolPermisoRepositorio } from '../../dominio/puertos/repositorios/rol-permiso-repositorio.interface';
import { SincronizarPermisosRolDto } from '../dtos/sincronizar-permisos-rol.dto';
import { ResultadoSincronizacionDto } from '../dtos/resultado-sincronizacion.dto';
import {
    RolNoValidoException,
    PermisoNoValidoException,
    RolPermisoDatosInvalidosException
} from '../../dominio/excepciones/rol-permiso-domain.exception';

export class SincronizarPermisosRolCasoUso {
    private readonly logger = new Logger(SincronizarPermisosRolCasoUso.name);

    constructor(
        private readonly rolPermisoRepositorio: RolPermisoRepositorio
    ) { }

    async ejecutar(
        idRol: number,
        datos: SincronizarPermisosRolDto,
        idUsuarioEjecutor: number
    ): Promise<ResultadoSincronizacionDto> {
        try {
            this.logger.log(
                `Iniciando sincronización de permisos para rol ID ${idRol}`,
                {
                    datosEntrada: {
                        idRol,
                        cantidadPermisosDeseados: datos.idsPermisosAsignados.length,
                        permisosDeseados: datos.idsPermisosAsignados,
                        idUsuarioEjecutor
                    }
                }
            );

            // 1. Validar que el rol existe y está activo
            const rolExiste = await this.rolPermisoRepositorio.rolExisteYEstaActivo(idRol);
            if (!rolExiste) {
                throw new RolNoValidoException(idRol);
            }

            // 2. Validar que todos los permisos existen y están activos
            if (datos.idsPermisosAsignados.length > 0) {
                const validacionPermisos = await this.rolPermisoRepositorio.validarPermisosExistenYActivos(
                    datos.idsPermisosAsignados
                );

                if (validacionPermisos.invalidos.length > 0) {
                    throw new RolPermisoDatosInvalidosException(
                        `Los siguientes permisos no existen o están inactivos: ${validacionPermisos.invalidos.join(', ')}`
                    );
                }
            }

            // 3. Obtener estado actual para calcular métricas
            const permisosActuales = await this.rolPermisoRepositorio.obtenerPermisosAsignadosDeRol(idRol);
            const idsPermisosActuales = permisosActuales.map(p => p.id);

            // 4. Calcular cambios
            const permisosAgregar = datos.idsPermisosAsignados.filter(id => !idsPermisosActuales.includes(id));
            const permisosRemover = idsPermisosActuales.filter(id => !datos.idsPermisosAsignados.includes(id));

            this.logger.log(
                `Análisis de cambios completado`,
                {
                    analisis: {
                        permisosActuales: idsPermisosActuales.length,
                        permisosDeseados: datos.idsPermisosAsignados.length,
                        permisosAgregar: permisosAgregar.length,
                        permisosRemover: permisosRemover.length,
                        permisosAAgregar: permisosAgregar,
                        permisosARemover: permisosRemover
                    }
                }
            );

            // 5. Ejecutar sincronización (transaccional en el repositorio)
            await this.rolPermisoRepositorio.sincronizarPermisosDeRol(
                idRol,
                datos.idsPermisosAsignados,
                idUsuarioEjecutor
            );

            // 6. Obtener nombre del rol para la respuesta
            const gestionActualizada = await this.rolPermisoRepositorio.obtenerGestionPermisosDeRol(idRol);

            this.logger.log(
                `Sincronización completada exitosamente para rol "${gestionActualizada.rol.nombre}"`,
                {
                    resultado: {
                        idRol,
                        nombreRol: gestionActualizada.rol.nombre,
                        permisosFinales: datos.idsPermisosAsignados.length,
                        permisosAgregados: permisosAgregar.length,
                        permisosRemovidos: permisosRemover.length,
                        sincronizadoPor: idUsuarioEjecutor,
                        timestamp: new Date().toISOString()
                    }
                }
            );

            return new ResultadoSincronizacionDto({
                idRol,
                nombreRol: gestionActualizada.rol.nombre,
                permisosAsignados: datos.idsPermisosAsignados.length,
                permisosRemovidos: permisosRemover.length,
                permisosAgregados: permisosAgregar.length,
                sincronizadoPor: idUsuarioEjecutor
            });

        } catch (error) {
            this.logger.error(
                `Error crítico en sincronización de permisos para rol ID ${idRol}: ${error.message}`,
                {
                    contextoError: {
                        idRol,
                        permisosIntentoAsignar: datos.idsPermisosAsignados,
                        idUsuarioEjecutor,
                        tipoError: error.constructor.name,
                        operacion: 'SINCRONIZAR_PERMISOS_ROL',
                        timestamp: new Date().toISOString()
                    }
                }
            );
            throw error;
        }
    }
}