// Clase base para todas las excepciones de dominio relacionadas con permisos
export abstract class PermisoDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Excepción para cuando se intenta crear un permiso con un nombre que ya existe
export class PermisoNombreDuplicadoException extends PermisoDomainException {
    constructor(nombre: string) {
        super(`Ya existe un permiso con el nombre "${nombre}"`);
    }
}

// Excepción para cuando se intenta crear un permiso con un código que ya existe
export class PermisoCodigoDuplicadoException extends PermisoDomainException {
    constructor(codigo: string) {
        super(`Ya existe un permiso con el código "${codigo}"`);
    }
}

// Excepción para cuando se busca un permiso que no existe
export class PermisoNoEncontradoException extends PermisoDomainException {
    constructor(id: number) {
        super(`No se encontró un permiso con ID ${id}`);
    }
}

// Excepción para cuando se intenta operar sobre un permiso inactivo
export class PermisoInactivoException extends PermisoDomainException {
    constructor(id: number) {
        super(`El permiso con ID ${id} está inactivo y no puede ser modificado`);
    }
}

// Excepción para cuando se intenta eliminar un permiso que tiene dependencias
export class PermisoConDependenciasException extends PermisoDomainException {
    constructor(id: number, dependencias: string[]) {
        super(`No se puede eliminar el permiso con ID ${id} porque tiene dependencias en: ${dependencias.join(', ')}`);
    }
}

// Excepción para validaciones de datos de entrada
export class PermisoDatosInvalidosException extends PermisoDomainException {
    constructor(mensaje: string) {
        super(mensaje);
    }
}