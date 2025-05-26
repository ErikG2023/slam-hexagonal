import { Logger } from '@nestjs/common';
import { RolPermisoRepositorio } from '../../dominio/puertos/repositorios/rol-permiso-repositorio.interface';
import { RolNoValidoException } from '../../dominio/excepciones/rol-permiso-domain.exception';

export interface ResultadoValidacion {
    rolValido: boolean;
    permisosValidos: number[];
    permisosInvalidos: number[];
    advertencias: string[];
    puedeGuardar: boolean;
}

export class ValidarPermisosParaAsignacionCasoUso {
    private readonly logger = new Logger(ValidarPermisosParaAsignacionCasoUso.name);

    constructor(
        private readonly rolPermisoRepositorio: RolPermisoRepositorio
    ) { }

    async ejecutar(idRol: number, idsPermisos: number[]): Promise<ResultadoValidacion> {
        try {
            this.logger.debug(`Validando asignación de permisos para rol ID ${idRol}`, {
                idRol,
                cantidadPermisos: idsPermisos.length,
                permisos: idsPermisos
            });

            const resultado: ResultadoValidacion = {
                rolValido: false,
                permisosValidos: [],
                permisosInvalidos: [],
                advertencias: [],
                puedeGuardar: false
            };

            // 1. Validar rol
            resultado.rolValido = await this.rolPermisoRepositorio.rolExisteYEstaActivo(idRol);
            if (!resultado.rolValido) {
                resultado.advertencias.push(`El rol con ID ${idRol} no existe o está inactivo`);
                return resultado;
            }

            // 2. Validar permisos (solo si hay permisos para validar)
            if (idsPermisos.length > 0) {
                const validacionPermisos = await this.rolPermisoRepositorio.validarPermisosExistenYActivos(idsPermisos);
                resultado.permisosValidos = validacionPermisos.validos;
                resultado.permisosInvalidos = validacionPermisos.invalidos;

                if (resultado.permisosInvalidos.length > 0) {
                    resultado.advertencias.push(
                        `Los siguientes permisos no existen o están inactivos: ${resultado.permisosInvalidos.join(', ')}`
                    );
                }
            } else {
                // Si no hay permisos, significa que se quiere remover todos (válido)
                resultado.permisosValidos = [];
                resultado.permisosInvalidos = [];
            }

            // 3. Determinar si se puede guardar
            resultado.puedeGuardar = resultado.rolValido && resultado.permisosInvalidos.length === 0;

            this.logger.debug(`Validación completada`, {
                resultado: {
                    rolValido: resultado.rolValido,
                    permisosValidos: resultado.permisosValidos.length,
                    permisosInvalidos: resultado.permisosInvalidos.length,
                    puedeGuardar: resultado.puedeGuardar,
                    advertencias: resultado.advertencias.length
                }
            });

            return resultado;

        } catch (error) {
            this.logger.error(`Error en validación de permisos para rol ID ${idRol}: ${error.message}`);
            throw error;
        }
    }
}