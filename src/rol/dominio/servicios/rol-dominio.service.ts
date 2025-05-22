import { Rol } from '../entidades/rol.entity';
import { RolRepositorio } from '../puertos/repositorios/rol-repositorio.interface';
import {
    RolNombreDuplicadoException,
    RolNoEncontradoException,
    RolInactivoException,
    RolConDependenciasException,
    RolDatosInvalidosException
} from '../excepciones/rol-domain.exception';

export interface ResultadoEliminacion {
    id: number;
    nombre: string;
    fechaEliminacion: Date;
    eliminadoPor: number;
}

export class RolDominioService {
    constructor(private readonly rolRepositorio: RolRepositorio) { }

    async validarNombreUnico(nombre: string, idExcluir?: number): Promise<void> {
        const existeNombre = await this.rolRepositorio.existeConNombre(nombre, idExcluir);
        if (existeNombre) {
            throw new RolNombreDuplicadoException(nombre);
        }
    }

    async validarExistenciaYEstadoActivo(id: number): Promise<Rol> {
        const rol = await this.rolRepositorio.buscarPorId(id);
        if (!rol) {
            throw new RolNoEncontradoException(id);
        }

        if (!rol.activo) {
            throw new RolInactivoException(id);
        }

        return rol;
    }

    async validarPuedeSerEliminado(id: number): Promise<void> {
        const resultadoValidacion = await this.rolRepositorio.puedeSerEliminado(id);

        if (!resultadoValidacion.puedeEliminarse) {
            throw new RolConDependenciasException(id, resultadoValidacion.dependencias || []);
        }
    }

    async crearRol(datos: {
        nombre: string;
        descripcion?: string;
        idUsuarioCreacion: number;
    }): Promise<Rol> {
        await this.validarNombreUnico(datos.nombre);

        const nuevoRol = new Rol({
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            idUsuarioCreacion: datos.idUsuarioCreacion,
        });

        return await this.rolRepositorio.guardar(nuevoRol);
    }

    async actualizarRol(id: number, datos: {
        nombre?: string;
        descripcion?: string;
        idUsuarioModificacion: number;
    }): Promise<Rol> {
        const rol = await this.validarExistenciaYEstadoActivo(id);

        if (datos.nombre && datos.nombre !== rol.nombre) {
            await this.validarNombreUnico(datos.nombre, id);
        }

        rol.actualizar(datos);
        return await this.rolRepositorio.guardar(rol);
    }

    async eliminarRol(id: number, idUsuarioEjecutor: number): Promise<ResultadoEliminacion> {
        // Primero obtenemos y validamos el rol
        const rol = await this.validarExistenciaYEstadoActivo(id);

        // Guardamos la información que necesitaremos para la respuesta
        const informacionRol = {
            id: rol.id,
            nombre: rol.nombre
        };

        // Validamos que puede ser eliminado
        await this.validarPuedeSerEliminado(id);

        // Ejecutamos la eliminación
        await this.rolRepositorio.eliminar(id, idUsuarioEjecutor);

        // Devolvemos información estructurada sobre lo que se eliminó
        return {
            id: informacionRol.id,
            nombre: informacionRol.nombre,
            fechaEliminacion: new Date(),
            eliminadoPor: idUsuarioEjecutor
        };
    }

    // Nueva funcionalidad: restaurar rol eliminado
    async restaurarRol(id: number, idUsuarioEjecutor: number): Promise<Rol> {
        const rol = await this.rolRepositorio.buscarPorId(id);
        if (!rol) {
            throw new RolNoEncontradoException(id);
        }

        if (rol.activo) {
            throw new RolDatosInvalidosException(`El rol con ID ${id} ya está activo`);
        }

        // Verificamos que no haya conflicto de nombres al restaurar
        await this.validarNombreUnico(rol.nombre, id);

        await this.rolRepositorio.restaurar(id, idUsuarioEjecutor);

        // Retornamos el rol actualizado
        const rolRestaurado = await this.rolRepositorio.buscarPorId(id);
        return rolRestaurado!;
    }
}