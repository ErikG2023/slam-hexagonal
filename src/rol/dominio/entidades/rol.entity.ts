export class Rol {
    private _id: number | undefined;
    private _nombre: string;
    private _descripcion: string | null;
    private _fechaCreacion: Date;
    private _idUsuarioCreacion: number | null;
    private _fechaModificacion: Date | null;
    private _idUsuarioModificacion: number | null;
    private _activo: boolean;

    constructor(params: {
        id?: number;
        nombre: string;
        descripcion?: string | null;
        fechaCreacion?: Date;
        idUsuarioCreacion?: number | null;
        fechaModificacion?: Date | null;
        idUsuarioModificacion?: number | null;
        activo?: boolean;
    }) {
        this.validarNombre(params.nombre);

        this._id = params.id;
        this._nombre = params.nombre.trim();
        this._descripcion = params.descripcion?.trim() || null;
        this._fechaCreacion = params.fechaCreacion || new Date();
        this._idUsuarioCreacion = params.idUsuarioCreacion || null;
        this._fechaModificacion = params.fechaModificacion || null;
        this._idUsuarioModificacion = params.idUsuarioModificacion || null;
        this._activo = params.activo !== undefined ? params.activo : true;
    }

    // Getters (sin cambios)
    get id(): number {
        if (this._id === undefined) {
            throw new Error('El rol no ha sido persistido aún');
        }
        return this._id;
    }

    get nombre(): string { return this._nombre; }
    get descripcion(): string | null { return this._descripcion; }
    get fechaCreacion(): Date { return this._fechaCreacion; }
    get idUsuarioCreacion(): number | null { return this._idUsuarioCreacion; }
    get fechaModificacion(): Date | null { return this._fechaModificacion; }
    get idUsuarioModificacion(): number | null { return this._idUsuarioModificacion; }
    get activo(): boolean { return this._activo; }

    // Métodos de negocio corregidos
    actualizar(datos: {
        nombre?: string;
        descripcion?: string;
        idUsuarioModificacion: number;
    }): void {
        let huboCambios = false; // Variable con nombre consistente

        if (datos.nombre && datos.nombre !== this._nombre) {
            this.validarNombre(datos.nombre);
            this._nombre = datos.nombre.trim();
            huboCambios = true;
        }

        if (datos.descripcion !== undefined && datos.descripcion !== this._descripcion) {
            this._descripcion = datos.descripcion?.trim() || null;
            huboCambios = true; // Nombre corregido para consistencia
        }

        if (huboCambios) {
            this._fechaModificacion = new Date();
            this._idUsuarioModificacion = datos.idUsuarioModificacion;
        }
    }

    desactivar(idUsuarioModificacion: number): void {
        if (!this._activo) {
            throw new Error('El rol ya está desactivado');
        }
        this._activo = false;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    activar(idUsuarioModificacion: number): void {
        if (this._activo) {
            throw new Error('El rol ya está activo');
        }
        this._activo = true;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    private validarNombre(nombre: string): void {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre del rol es requerido');
        }
        if (nombre.trim().length < 2) {
            throw new Error('El nombre del rol debe tener al menos 2 caracteres');
        }
        if (nombre.trim().length > 50) {
            throw new Error('El nombre del rol no puede exceder 50 caracteres');
        }
        const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_]+$/;
        if (!caracteresPermitidos.test(nombre.trim())) {
            throw new Error('El nombre del rol contiene caracteres no permitidos');
        }
    }

    puedeSerModificado(): boolean {
        return this._activo;
    }

    toString(): string {
        return `Rol[id=${this._id}, nombre=${this._nombre}, activo=${this._activo}]`;
    }
}