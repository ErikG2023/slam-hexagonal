// Clase base para todas las excepciones de dominio relacionadas con usuarios
export abstract class UsuarioDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Excepción para cuando se intenta crear un usuario con un username que ya existe
export class UsuarioUsernameDuplicadoException extends UsuarioDomainException {
    constructor(username: string) {
        super(`Ya existe un usuario con el nombre de usuario "${username}"`);
    }
}

// Excepción para cuando se busca un usuario que no existe
export class UsuarioNoEncontradoException extends UsuarioDomainException {
    constructor(id: number) {
        super(`No se encontró un usuario con ID ${id}`);
    }
}

// Excepción para cuando se intenta operar sobre un usuario inactivo
export class UsuarioInactivoException extends UsuarioDomainException {
    constructor(id: number) {
        super(`El usuario con ID ${id} está inactivo y no puede ser modificado`);
    }
}

// Excepción para cuando se intenta operar sobre un usuario bloqueado
export class UsuarioBloqueadoException extends UsuarioDomainException {
    constructor(username: string) {
        super(`El usuario "${username}" está bloqueado y no puede iniciar sesión`);
    }
}

// Excepción para cuando se intenta eliminar un usuario que tiene dependencias
export class UsuarioConDependenciasException extends UsuarioDomainException {
    constructor(id: number, dependencias: string[]) {
        super(`No se puede eliminar el usuario con ID ${id} porque tiene dependencias en: ${dependencias.join(', ')}`);
    }
}

// Excepción para cuando la persona ya tiene un usuario asignado
export class PersonaYaTieneUsuarioException extends UsuarioDomainException {
    constructor(idPersona: number) {
        super(`La persona con ID ${idPersona} ya tiene un usuario asignado`);
    }
}

// Excepción para cuando se busca una persona que no existe
export class PersonaNoValidaException extends UsuarioDomainException {
    constructor(idPersona: number) {
        super(`La persona con ID ${idPersona} no existe o no está activa`);
    }
}

// Excepción para cuando se busca un rol que no existe
export class RolNoValidoException extends UsuarioDomainException {
    constructor(idRol: number) {
        super(`El rol con ID ${idRol} no existe o no está activo`);
    }
}

// Excepción para validaciones de datos de entrada
export class UsuarioDatosInvalidosException extends UsuarioDomainException {
    constructor(mensaje: string) {
        super(mensaje);
    }
}

// Excepción para credenciales inválidas
export class CredencialesInvalidasException extends UsuarioDomainException {
    constructor() {
        super('Las credenciales proporcionadas son incorrectas');
    }
}