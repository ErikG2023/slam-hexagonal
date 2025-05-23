import { Permiso } from '../entidades/permiso.entity';
import { PermisoRepositorio } from '../puertos/repositorios/permiso-repositorio.interface';
import {
    PermisoNombreDuplicadoException,
    PermisoCodigoDuplicadoException,
    PermisoNoEncontradoException,
    PermisoInactivoException,
    PermisoConDependenciasException,
    PermisoDatosInvalidosException
} from '../excepciones/permiso-domain.exception';

export interface ResultadoEliminacion {
    id: number;
    nombre: string;
    codigo: string;
    fechaEliminacion: Date;
    eliminadoPor: number;
}

export class PermisoDominioService {
    constructor(private readonly permisoRepositorio: PermisoRepositorio) { }

    async validarNombreUnico(nombre: string, idExcluir?: number): Promise<void> {
        const existeNombre = await this.permisoRepositorio.existeConNombre(nombre, idExcluir);
        if (existeNombre) {
            throw new PermisoNombreDuplicadoException(nombre);
        }
    }

    async validarCodigoUnico(codigo: string, idExcluir?: number): Promise<void> {
        const existeCodigo = await this.permisoRepositorio.existeConCodigo(codigo, idExcluir);
        if (existeCodigo) {
            throw new PermisoCodigoDuplicadoException(codigo);
        }
    }

    async validarExistenciaYEstadoActivo(id: number): Promise<Permiso> {
        const permiso = await this.permisoRepositorio.buscarPorId(id);
        if (!permiso) {
            throw new PermisoNoEncontradoException(id);
        }

        if (!permiso.activo) {
            throw new PermisoInactivoException(id);
        }

        return permiso;
    }

    async validarPuedeSerEliminado(id: number): Promise<void> {
        const resultadoValidacion = await this.permisoRepositorio.puedeSerEliminado(id);

        if (!resultadoValidacion.puedeEliminarse) {
            throw new PermisoConDependenciasException(id, resultadoValidacion.dependencias || []);
        }
    }

    async crearPermiso(datos: {
        nombre: string;
        descripcion?: string;
        codigo: string;
        idUsuarioCreacion: number;
    }): Promise<Permiso> {
        await this.validarNombreUnico(datos.nombre);
        await this.validarCodigoUnico(datos.codigo);

        const nuevoPermiso = new Permiso({
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            codigo: datos.codigo,
            idUsuarioCreacion: datos.idUsuarioCreacion,
        });

        return await this.permisoRepositorio.guardar(nuevoPermiso);
    }

    async actualizarPermiso(id: number, datos: {
        nombre?: string;
        descripcion?: string;
        codigo?: string;
        idUsuarioModificacion: number;
    }): Promise<Permiso> {
        const permiso = await this.validarExistenciaYEstadoActivo(id);

        if (datos.nombre && datos.nombre !== permiso.nombre) {
            await this.validarNombreUnico(datos.nombre, id);
        }

        if (datos.codigo && datos.codigo !== permiso.codigo) {
            await this.validarCodigoUnico(datos.codigo, id);
        }

        permiso.actualizar(datos);
        return await this.permisoRepositorio.guardar(permiso);
    }

    async eliminarPermiso(id: number, idUsuarioEjecutor: number): Promise<ResultadoEliminacion> {
        // Primero obtenemos y validamos el permiso
        const permiso = await this.validarExistenciaYEstadoActivo(id);

        // Guardamos la información que necesitaremos para la respuesta
        const informacionPermiso = {
            id: permiso.id,
            nombre: permiso.nombre,
            codigo: permiso.codigo
        };

        // Validamos que puede ser eliminado
        await this.validarPuedeSerEliminado(id);

        // Ejecutamos la eliminación
        await this.permisoRepositorio.eliminar(id, idUsuarioEjecutor);

        // Devolvemos información estructurada sobre lo que se eliminó
        return {
            id: informacionPermiso.id,
            nombre: informacionPermiso.nombre,
            codigo: informacionPermiso.codigo,
            fechaEliminacion: new Date(),
            eliminadoPor: idUsuarioEjecutor
        };
    }

    // Nueva funcionalidad: restaurar permiso eliminado
    async restaurarPermiso(id: number, idUsuarioEjecutor: number): Promise<Permiso> {
        const permiso = await this.permisoRepositorio.buscarPorId(id);
        if (!permiso) {
            throw new PermisoNoEncontradoException(id);
        }

        if (permiso.activo) {
            throw new PermisoDatosInvalidosException(`El permiso con ID ${id} ya está activo`);
        }

        // Verificamos que no haya conflicto de nombres y códigos al restaurar
        await this.validarNombreUnico(permiso.nombre, id);
        await this.validarCodigoUnico(permiso.codigo, id);

        await this.permisoRepositorio.restaurar(id, idUsuarioEjecutor);

        // Retornamos el permiso actualizado
        const permisoRestaurado = await this.permisoRepositorio.buscarPorId(id);
        return permisoRestaurado!;
    }
}