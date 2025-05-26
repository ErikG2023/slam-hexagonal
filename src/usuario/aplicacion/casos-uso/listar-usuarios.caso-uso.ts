import { Logger } from '@nestjs/common';
import { UsuarioRepositorio } from '../../dominio/puertos/repositorios/usuario-repositorio.interface';
import { UsuarioConDetallesDto } from '../dtos/usuario-con-detalles.dto';

export enum TipoFiltroEstado {
    ACTIVOS = 'activos',
    ELIMINADOS = 'eliminados',
    TODOS = 'todos'
}

export enum TipoFiltroBloqueado {
    BLOQUEADOS = 'bloqueados',
    NO_BLOQUEADOS = 'no_bloqueados',
    TODOS = 'todos'
}

export interface FiltrosListarUsuarios {
    estado?: TipoFiltroEstado;
    bloqueado?: TipoFiltroBloqueado;
    idRol?: number;
    username?: string;
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
        bloqueado: TipoFiltroBloqueado;
        idRol?: number;
        username?: string;
    };
}

export class ListarUsuariosCasoUso {
    private readonly logger = new Logger(ListarUsuariosCasoUso.name);

    constructor(
        private readonly usuarioRepositorio: UsuarioRepositorio
    ) { }

    async ejecutar(filtros: FiltrosListarUsuarios = {}): Promise<ResultadoPaginado<UsuarioConDetallesDto>> {
        try {
            const limite = filtros.limite || 10;
            const offset = filtros.offset || 0;
            const estado = filtros.estado || TipoFiltroEstado.ACTIVOS;
            const bloqueado = filtros.bloqueado || TipoFiltroBloqueado.TODOS;

            this.logger.log('Listando usuarios', {
                filtros: {
                    estado,
                    bloqueado,
                    idRol: filtros.idRol || 'sin filtro',
                    username: filtros.username || 'sin filtro',
                    paginacion: { limite, offset }
                }
            });

            const filtrosRepositorio = this.convertirFiltrosParaRepositorio(filtros, estado, bloqueado);

            const [usuarios, total] = await Promise.all([
                this.usuarioRepositorio.listarConDetalles(filtrosRepositorio),
                this.usuarioRepositorio.contarRegistros(this.getFiltrosConteo(estado, bloqueado))
            ]);

            this.logger.log(
                `Consulta de usuarios completada: ${usuarios.length} usuarios obtenidos de ${total} totales`,
                {
                    metricas: {
                        resultadosEncontrados: usuarios.length,
                        totalDisponible: total,
                        filtroEstado: estado,
                        filtroBloqueado: bloqueado,
                        tiempoRespuesta: 'rápido'
                    }
                }
            );

            const usuariosDto = usuarios.map(usuario => new UsuarioConDetallesDto(usuario));
            const totalPaginas = Math.ceil(total / limite);
            const paginaActual = Math.floor(offset / limite) + 1;

            return {
                datos: usuariosDto,
                total,
                limite,
                offset,
                totalPaginas,
                paginaActual,
                filtrosAplicados: {
                    estado,
                    bloqueado,
                    idRol: filtros.idRol,
                    username: filtros.username
                }
            };

        } catch (error) {
            this.logger.error(
                `Error al listar usuarios: ${error.message}`,
                {
                    filtrosAplicados: filtros,
                    tipoError: error.constructor.name
                }
            );
            throw error;
        }
    }

    private convertirFiltrosParaRepositorio(filtros: FiltrosListarUsuarios, estado: TipoFiltroEstado, bloqueado: TipoFiltroBloqueado): any {
        const filtrosRepo: any = {
            limite: filtros.limite,
            offset: filtros.offset,
            username: filtros.username,
            idRol: filtros.idRol
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

        switch (bloqueado) {
            case TipoFiltroBloqueado.BLOQUEADOS:
                filtrosRepo.bloqueado = true;
                break;
            case TipoFiltroBloqueado.NO_BLOQUEADOS:
                filtrosRepo.bloqueado = false;
                break;
            case TipoFiltroBloqueado.TODOS:
                break;
        }

        return filtrosRepo;
    }

    private getFiltrosConteo(estado: TipoFiltroEstado, bloqueado: TipoFiltroBloqueado): any {
        const filtros: any = {};

        switch (estado) {
            case TipoFiltroEstado.ACTIVOS:
                filtros.activo = true;
                break;
            case TipoFiltroEstado.ELIMINADOS:
                filtros.activo = false;
                break;
            case TipoFiltroEstado.TODOS:
                break;
        }

        switch (bloqueado) {
            case TipoFiltroBloqueado.BLOQUEADOS:
                filtros.bloqueado = true;
                break;
            case TipoFiltroBloqueado.NO_BLOQUEADOS:
                filtros.bloqueado = false;
                break;
            case TipoFiltroBloqueado.TODOS:
                break;
        }

        return filtros;
    }
}