import { Logger } from '@nestjs/common';
import { PermisoRepositorio } from '../../dominio/puertos/repositorios/permiso-repositorio.interface';
import { PermisoRespuestaDto } from '../dtos/permiso-respuesta.dto';

export enum TipoFiltroEstado {
    ACTIVOS = 'activos',
    ELIMINADOS = 'eliminados',
    TODOS = 'todos'
}

export interface FiltrosListarPermisos {
    estado?: TipoFiltroEstado;
    nombre?: string;
    codigo?: string;
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
        codigo?: string;
    };
}

export class ListarPermisosCasoUso {
    private readonly logger = new Logger(ListarPermisosCasoUso.name);

    constructor(
        private readonly permisoRepositorio: PermisoRepositorio
    ) { }

    async ejecutar(filtros: FiltrosListarPermisos = {}): Promise<ResultadoPaginado<PermisoRespuestaDto>> {
        try {
            const limite = filtros.limite || 10;
            const offset = filtros.offset || 0;
            const estado = filtros.estado || TipoFiltroEstado.ACTIVOS;

            this.logger.log('Listando permisos', {
                filtros: {
                    estado,
                    nombre: filtros.nombre || 'sin filtro',
                    codigo: filtros.codigo || 'sin filtro',
                    paginacion: { limite, offset }
                }
            });

            const filtrosRepositorio = this.convertirFiltrosParaRepositorio(filtros, estado);

            const [permisos, total] = await Promise.all([
                this.permisoRepositorio.buscarTodos(filtrosRepositorio),
                this.permisoRepositorio.contarRegistros(this.getFiltrosConteo(estado))
            ]);

            this.logger.log(
                `Consulta de permisos completada: ${permisos.length} permisos obtenidos de ${total} totales`,
                {
                    metricas: {
                        resultadosEncontrados: permisos.length,
                        totalDisponible: total,
                        filtroEstado: estado,
                        tiempoRespuesta: 'rápido'
                    }
                }
            );

            const permisosDto = permisos.map(permiso => new PermisoRespuestaDto(permiso));
            const totalPaginas = Math.ceil(total / limite);
            const paginaActual = Math.floor(offset / limite) + 1;

            return {
                datos: permisosDto,
                total,
                limite,
                offset,
                totalPaginas,
                paginaActual,
                filtrosAplicados: {
                    estado,
                    nombre: filtros.nombre,
                    codigo: filtros.codigo
                }
            };

        } catch (error) {
            this.logger.error(
                `Error al listar permisos: ${error.message}`,
                {
                    filtrosAplicados: filtros,
                    tipoError: error.constructor.name
                }
            );
            throw error;
        }
    }

    private convertirFiltrosParaRepositorio(filtros: FiltrosListarPermisos, estado: TipoFiltroEstado): any {
        const filtrosRepo: any = {
            limite: filtros.limite,
            offset: filtros.offset,
            nombre: filtros.nombre,
            codigo: filtros.codigo
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