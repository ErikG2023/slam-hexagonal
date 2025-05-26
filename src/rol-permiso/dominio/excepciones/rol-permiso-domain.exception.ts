// Clase base para todas las excepciones de dominio relacionadas con rol-permiso
export abstract class RolPermisoDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Excepción para cuando se intenta asignar un permiso que ya está asignado
export class PermisoYaAsignnadoException extends RolPermisoDomainException {
    constructor(idRol: number, idPermiso: number) {
        super(`El permiso ${idPermiso} ya está asignado al rol ${idRol}`);
    }
}

// Excepción para cuando no se encuentra una asignación específica
export class AsignacionNoEncontradaException extends RolPermisoDomainException {
    constructor(idRol: number, idPermiso: number) {
        super(`No se encontró asignación entre rol ${idRol} y permiso ${idPermiso}`);
    }
}

// Excepción para cuando se busca un rol que no existe
export class RolNoValidoException extends RolPermisoDomainException {
    constructor(idRol: number) {
        super(`El rol con ID ${idRol} no existe o no está activo`);
    }
}

// Excepción para cuando se busca un permiso que no existe
export class PermisoNoValidoException extends RolPermisoDomainException {
    constructor(idPermiso: number) {
        super(`El permiso con ID ${idPermiso} no existe o no está activo`);
    }
}

// Excepción para validaciones de datos de entrada
export class RolPermisoDatosInvalidosException extends RolPermisoDomainException {
    constructor(mensaje: string) {
        super(mensaje);
    }
}