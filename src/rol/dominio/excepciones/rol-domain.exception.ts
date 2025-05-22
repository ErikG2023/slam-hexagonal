// Clase base para todas las excepciones de dominio relacionadas con roles
export abstract class RolDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Excepción para cuando se intenta crear un rol con un nombre que ya existe
export class RolNombreDuplicadoException extends RolDomainException {
    constructor(nombre: string) {
        super(`Ya existe un rol con el nombre "${nombre}"`);
    }
}

// Excepción para cuando se busca un rol que no existe
export class RolNoEncontradoException extends RolDomainException {
    constructor(id: number) {
        super(`No se encontró un rol con ID ${id}`);
    }
}

// Excepción para cuando se intenta operar sobre un rol inactivo
export class RolInactivoException extends RolDomainException {
    constructor(id: number) {
        super(`El rol con ID ${id} está inactivo y no puede ser modificado`);
    }
}

// Excepción para cuando se intenta eliminar un rol que tiene dependencias
export class RolConDependenciasException extends RolDomainException {
    constructor(id: number, dependencias: string[]) {
        super(`No se puede eliminar el rol con ID ${id} porque tiene dependencias en: ${dependencias.join(', ')}`);
    }
}

// Excepción para validaciones de datos de entrada
export class RolDatosInvalidosException extends RolDomainException {
    constructor(mensaje: string) {
        super(mensaje);
    }
}