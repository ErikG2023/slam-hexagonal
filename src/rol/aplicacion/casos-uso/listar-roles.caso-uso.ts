import { Logger } from '@nestjs/common';
import { RolRepositorio } from '../../dominio/puertos/repositorios/rol-repositorio.interface';
import { RolRespuestaDto } from '../dtos/rol-respuesta.dto';

export enum TipoFiltroEstado {
    ACTIVOS = 'activos',
    ELIMINADOS = 'eliminados',
    TODOS = 'todos'
}

export interface FiltrosListarRoles {
    estado?: TipoFiltroEstado;
    nombre?: string;
    limite?: number;
    offset?: number;
}

export interface ResultadoPaginado<T> {
    datos: T[];
    total: number;
    limite: number;
    offset: number;
    totalPaginas: number;
    paginaActual: number;
    filtrosAplicados: {
        estado: TipoFiltroEstado;
        nombre?: string;
    };
}

export class ListarRolesCasoUso {
    private readonly logger = new Logger(ListarRolesCasoUso.name);

    constructor(
        private readonly rolRepositorio: RolRepositorio
    ) { }

    async ejecutar(filtros: FiltrosListarRoles = {}): Promise<ResultadoPaginado<RolRespuestaDto>> {
        try {
            const limite = filtros.limite || 10;
            const offset = filtros.offset || 0;
            const estado = filtros.estado || TipoFiltroEstado.ACTIVOS;

            // Log con información estructurada sobre los filtros aplicados
            this.logger.log('Listando roles', {
                filtros: {
                    estado,
                    nombre: filtros.nombre || 'sin filtro',
                    paginacion: { limite, offset }
                }
            });

            const filtrosRepositorio = this.convertirFiltrosParaRepositorio(filtros, estado);

            const [roles, total] = await Promise.all([
                this.rolRepositorio.buscarTodos(filtrosRepositorio),
                this.rolRepositorio.contarRegistros(this.getFiltrosConteo(estado))
            ]);

            // Log con métricas útiles sobre los resultados
            this.logger.log(
                `Consulta de roles completada: ${roles.length} roles obtenidos de ${total} totales`,
                {
                    metricas: {
                        resultadosEncontrados: roles.length,
                        totalDisponible: total,
                        filtroEstado: estado,
                        tiempoRespuesta: 'rápido' // En una implementación real, podríamos medir tiempo real
                    }
                }
            );

            const rolesDto = roles.map(rol => new RolRespuestaDto(rol));
            const totalPaginas = Math.ceil(total / limite);
            const paginaActual = Math.floor(offset / limite) + 1;

            return {
                datos: rolesDto,
                total,
                limite,
                offset,
                totalPaginas,
                paginaActual,
                filtrosAplicados: {
                    estado,
                    nombre: filtros.nombre
                }
            };

        } catch (error) {
            this.logger.error(
                `Error al listar roles: ${error.message}`,
                {
                    filtrosAplicados: filtros,
                    tipoError: error.constructor.name
                }
            );
            throw error;
        }
    }

    private convertirFiltrosParaRepositorio(filtros: FiltrosListarRoles, estado: TipoFiltroEstado): any {
        const filtrosRepo: any = {
            limite: filtros.limite,
            offset: filtros.offset,
            nombre: filtros.nombre
        };

        switch (estado) {
            case TipoFiltroEstado.ACTIVOS:
                filtrosRepo.activo = true;
                break;
            case TipoFiltroEstado.ELIMINADOS:
                filtrosRepo.activo = false;
                break;
            case TipoFiltroEstado.TODOS:
                break;
        }

        return filtrosRepo;
    }

    private getFiltrosConteo(estado: TipoFiltroEstado): any {
        switch (estado) {
            case TipoFiltroEstado.ACTIVOS:
                return { activo: true };
            case TipoFiltroEstado.ELIMINADOS:
                return { activo: false };
            case TipoFiltroEstado.TODOS:
                return {};
        }
    }
}