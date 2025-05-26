import { Usuario } from '../entidades/usuario.entity';
import { UsuarioRepositorio } from '../puertos/repositorios/usuario-repositorio.interface';
import {
    UsuarioUsernameDuplicadoException,
    UsuarioNoEncontradoException,
    UsuarioInactivoException,
    UsuarioConDependenciasException,
    PersonaYaTieneUsuarioException,
    PersonaNoValidaException,
    RolNoValidoException,
    UsuarioDatosInvalidosException
} from '../excepciones/usuario-domain.exception';

export interface ResultadoEliminacion {
    id: number;
    username: string;
    nombreCompleto: string;
    fechaEliminacion: Date;
    eliminadoPor: number;
}

export class UsuarioDominioService {
    constructor(private readonly usuarioRepositorio: UsuarioRepositorio) { }

    async validarUsernameUnico(username: string, idExcluir?: number): Promise<void> {
        const existeUsername = await this.usuarioRepositorio.existeConUsername(username, idExcluir);
        if (existeUsername) {
            throw new UsuarioUsernameDuplicadoException(username);
        }
    }

    async validarPersonaUnica(idPersona: number, idExcluir?: number): Promise<void> {
        const personaTieneUsuario = await this.usuarioRepositorio.personaYaTieneUsuario(idPersona, idExcluir);
        if (personaTieneUsuario) {
            throw new PersonaYaTieneUsuarioException(idPersona);
        }
    }

    async validarPersonaExiste(idPersona: number): Promise<void> {
        const personaExiste = await this.usuarioRepositorio.personaExisteYEstaActiva(idPersona);
        if (!personaExiste) {
            throw new PersonaNoValidaException(idPersona);
        }
    }

    async validarRolExiste(idRol: number): Promise<void> {
        const rolExiste = await this.usuarioRepositorio.rolExisteYEstaActivo(idRol);
        if (!rolExiste) {
            throw new RolNoValidoException(idRol);
        }
    }

    async validarExistenciaYEstadoActivo(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepositorio.buscarPorId(id);
        if (!usuario) {
            throw new UsuarioNoEncontradoException(id);
        }

        if (!usuario.activo) {
            throw new UsuarioInactivoException(id);
        }

        return usuario;
    }

    async validarPuedeSerEliminado(id: number): Promise<void> {
        const resultadoValidacion = await this.usuarioRepositorio.puedeSerEliminado(id);

        if (!resultadoValidacion.puedeEliminarse) {
            throw new UsuarioConDependenciasException(id, resultadoValidacion.dependencias || []);
        }
    }

    async crearUsuario(datos: {
        idPersona: number;
        idRol: number;
        username: string;
        passwordHash: string; // Ya viene hasheada desde el caso de uso
        idUsuarioCreacion: number;
    }): Promise<Usuario> {
        // Validaciones de dominio
        await this.validarPersonaExiste(datos.idPersona);
        await this.validarRolExiste(datos.idRol);
        await this.validarUsernameUnico(datos.username);
        await this.validarPersonaUnica(datos.idPersona);

        const nuevoUsuario = new Usuario({
            idPersona: datos.idPersona,
            idRol: datos.idRol,
            username: datos.username,
            password: datos.passwordHash,
            idUsuarioCreacion: datos.idUsuarioCreacion,
        });

        return await this.usuarioRepositorio.guardar(nuevoUsuario);
    }

    async actualizarUsuario(id: number, datos: {
        idRol?: number;
        bloqueado?: boolean;
        idUsuarioModificacion: number;
    }): Promise<Usuario> {
        const usuario = await this.validarExistenciaYEstadoActivo(id);

        if (datos.idRol && datos.idRol !== usuario.idRol) {
            await this.validarRolExiste(datos.idRol);
        }

        usuario.actualizar(datos);
        return await this.usuarioRepositorio.guardar(usuario);
    }

    async cambiarPassword(id: number, datos: {
        nuevaPasswordHash: string; // Ya viene hasheada desde el caso de uso
        idUsuarioModificacion: number;
    }): Promise<Usuario> {
        const usuario = await this.validarExistenciaYEstadoActivo(id);

        usuario.cambiarPassword(datos.nuevaPasswordHash, datos.idUsuarioModificacion);
        return await this.usuarioRepositorio.guardar(usuario);
    }

    async bloquearUsuario(id: number, idUsuarioEjecutor: number): Promise<Usuario> {
        const usuario = await this.validarExistenciaYEstadoActivo(id);

        usuario.bloquear(idUsuarioEjecutor);
        return await this.usuarioRepositorio.guardar(usuario);
    }

    async desbloquearUsuario(id: number, idUsuarioEjecutor: number): Promise<Usuario> {
        const usuario = await this.validarExistenciaYEstadoActivo(id);

        usuario.desbloquear(idUsuarioEjecutor);
        return await this.usuarioRepositorio.guardar(usuario);
    }

    async eliminarUsuario(id: number, idUsuarioEjecutor: number): Promise<ResultadoEliminacion> {
        // Primero obtenemos los detalles del usuario
        const usuarioDetalles = await this.usuarioRepositorio.buscarConDetalles(id);
        if (!usuarioDetalles) {
            throw new UsuarioNoEncontradoException(id);
        }

        if (!usuarioDetalles.activo) {
            throw new UsuarioInactivoException(id);
        }

        // Validamos que puede ser eliminado
        await this.validarPuedeSerEliminado(id);

        // Ejecutamos la eliminación
        await this.usuarioRepositorio.eliminar(id, idUsuarioEjecutor);

        // Devolvemos información estructurada sobre lo que se eliminó
        return {
            id: usuarioDetalles.id,
            username: usuarioDetalles.username,
            nombreCompleto: usuarioDetalles.nombreCompleto,
            fechaEliminacion: new Date(),
            eliminadoPor: idUsuarioEjecutor
        };
    }

    async restaurarUsuario(id: number, idUsuarioEjecutor: number): Promise<Usuario> {
        const usuario = await this.usuarioRepositorio.buscarPorId(id);
        if (!usuario) {
            throw new UsuarioNoEncontradoException(id);
        }

        if (usuario.activo) {
            throw new UsuarioDatosInvalidosException(`El usuario con ID ${id} ya está activo`);
        }

        // Verificamos que no haya conflicto de username al restaurar
        await this.validarUsernameUnico(usuario.username, id);
        await this.validarPersonaUnica(usuario.idPersona, id);

        await this.usuarioRepositorio.restaurar(id, idUsuarioEjecutor);

        // Retornamos el usuario actualizado
        const usuarioRestaurado = await this.usuarioRepositorio.buscarPorId(id);
        return usuarioRestaurado!;
    }
}