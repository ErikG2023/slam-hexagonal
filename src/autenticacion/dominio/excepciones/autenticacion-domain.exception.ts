// Clase base para todas las excepciones de dominio de autenticación
export abstract class AutenticacionDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Credenciales inválidas
export class CredencialesInvalidasException extends AutenticacionDomainException {
    constructor() {
        super('Credenciales inválidas');
    }
}

// Token inválido
export class TokenInvalidoException extends AutenticacionDomainException {
    constructor(razon?: string) {
        super(`Token inválido${razon ? `: ${razon}` : ''}`);
    }
}

// Token expirado
export class TokenExpiradoException extends AutenticacionDomainException {
    constructor() {
        super('El token ha expirado');
    }
}

// Sesión no encontrada
export class SesionNoEncontradaException extends AutenticacionDomainException {
    constructor(sessionId: string) {
        super(`No se encontró la sesión con ID ${sessionId}`);
    }
}

// Sesión expirada
export class SesionExpiradaException extends AutenticacionDomainException {
    constructor() {
        super('La sesión ha expirado');
    }
}

// Máximo de sesiones alcanzado
export class MaximoSesionesException extends AutenticacionDomainException {
    constructor(limite: number) {
        super(`Se ha alcanzado el límite máximo de ${limite} sesiones simultáneas`);
    }
}

// Datos de sesión inválidos
export class SesionDatosInvalidosException extends AutenticacionDomainException {
    constructor(mensaje: string) {
        super(mensaje);
    }
}