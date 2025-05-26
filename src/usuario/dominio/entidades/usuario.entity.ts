export class Usuario {
    private _id: number | undefined;
    private _idPersona: number;
    private _idRol: number;
    private _username: string;
    private _password: string;
    private _bloqueado: boolean;
    private _ultimoAcceso: Date | null;
    private _fechaCreacion: Date;
    private _idUsuarioCreacion: number | null;
    private _fechaModificacion: Date | null;
    private _idUsuarioModificacion: number | null;
    private _activo: boolean;

    constructor(params: {
        id?: number;
        idPersona: number;
        idRol: number;
        username: string;
        password: string;
        bloqueado?: boolean;
        ultimoAcceso?: Date | null;
        fechaCreacion?: Date;
        idUsuarioCreacion?: number | null;
        fechaModificacion?: Date | null;
        idUsuarioModificacion?: number | null;
        activo?: boolean;
    }) {
        this.validarIdPersona(params.idPersona);
        this.validarIdRol(params.idRol);
        this.validarUsername(params.username);
        this.validarPassword(params.password);

        this._id = params.id;
        this._idPersona = params.idPersona;
        this._idRol = params.idRol;
        this._username = params.username.trim().toLowerCase();
        this._password = params.password;
        this._bloqueado = params.bloqueado !== undefined ? params.bloqueado : false;
        this._ultimoAcceso = params.ultimoAcceso || null;
        this._fechaCreacion = params.fechaCreacion || new Date();
        this._idUsuarioCreacion = params.idUsuarioCreacion || null;
        this._fechaModificacion = params.fechaModificacion || null;
        this._idUsuarioModificacion = params.idUsuarioModificacion || null;
        this._activo = params.activo !== undefined ? params.activo : true;
    }

    // Getters
    get id(): number {
        if (this._id === undefined) {
            throw new Error('El usuario no ha sido persistido aún');
        }
        return this._id;
    }

    get idPersona(): number { return this._idPersona; }
    get idRol(): number { return this._idRol; }
    get username(): string { return this._username; }
    get password(): string { return this._password; }
    get bloqueado(): boolean { return this._bloqueado; }
    get ultimoAcceso(): Date | null { return this._ultimoAcceso; }
    get fechaCreacion(): Date { return this._fechaCreacion; }
    get idUsuarioCreacion(): number | null { return this._idUsuarioCreacion; }
    get fechaModificacion(): Date | null { return this._fechaModificacion; }
    get idUsuarioModificacion(): number | null { return this._idUsuarioModificacion; }
    get activo(): boolean { return this._activo; }

    // Métodos de negocio
    actualizar(datos: {
        idRol?: number;
        bloqueado?: boolean;
        idUsuarioModificacion: number;
    }): void {
        let huboCambios = false;

        if (datos.idRol && datos.idRol !== this._idRol) {
            this.validarIdRol(datos.idRol);
            this._idRol = datos.idRol;
            huboCambios = true;
        }

        if (datos.bloqueado !== undefined && datos.bloqueado !== this._bloqueado) {
            this._bloqueado = datos.bloqueado;
            huboCambios = true;
        }

        if (huboCambios) {
            this._fechaModificacion = new Date();
            this._idUsuarioModificacion = datos.idUsuarioModificacion;
        }
    }

    cambiarPassword(nuevaPassword: string, idUsuarioModificacion: number): void {
        this.validarPassword(nuevaPassword);
        this._password = nuevaPassword;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    bloquear(idUsuarioModificacion: number): void {
        if (this._bloqueado) {
            throw new Error('El usuario ya está bloqueado');
        }
        this._bloqueado = true;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    desbloquear(idUsuarioModificacion: number): void {
        if (!this._bloqueado) {
            throw new Error('El usuario no está bloqueado');
        }
        this._bloqueado = false;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    registrarAcceso(): void {
        this._ultimoAcceso = new Date();
    }

    desactivar(idUsuarioModificacion: number): void {
        if (!this._activo) {
            throw new Error('El usuario ya está desactivado');
        }
        this._activo = false;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    activar(idUsuarioModificacion: number): void {
        if (this._activo) {
            throw new Error('El usuario ya está activo');
        }
        this._activo = true;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    private validarIdPersona(idPersona: number): void {
        if (!idPersona || idPersona <= 0) {
            throw new Error('El ID de la persona es requerido y debe ser mayor a 0');
        }
    }

    private validarIdRol(idRol: number): void {
        if (!idRol || idRol <= 0) {
            throw new Error('El ID del rol es requerido y debe ser mayor a 0');
        }
    }

    private validarUsername(username: string): void {
        if (!username || username.trim().length === 0) {
            throw new Error('El nombre de usuario es requerido');
        }
        if (username.trim().length < 3) {
            throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
        }
        if (username.trim().length > 50) {
            throw new Error('El nombre de usuario no puede exceder 50 caracteres');
        }
        const caracteresPermitidos = /^[a-zA-Z0-9._-]+$/;
        if (!caracteresPermitidos.test(username.trim())) {
            throw new Error('El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos');
        }
    }

    private validarPassword(password: string): void {
        if (!password || password.length === 0) {
            throw new Error('La contraseña es requerida');
        }
        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        if (password.length > 100) {
            throw new Error('La contraseña no puede exceder 100 caracteres');
        }
    }

    puedeIniciarSesion(): boolean {
        return this._activo && !this._bloqueado;
    }

    toString(): string {
        return `Usuario[id=${this._id}, username=${this._username}, activo=${this._activo}, bloqueado=${this._bloqueado}]`;
    }
}