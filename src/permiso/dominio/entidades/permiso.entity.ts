export class Permiso {
    private _id: number | undefined;
    private _nombre: string;
    private _descripcion: string | null;
    private _codigo: string;
    private _fechaCreacion: Date;
    private _idUsuarioCreacion: number | null;
    private _fechaModificacion: Date | null;
    private _idUsuarioModificacion: number | null;
    private _activo: boolean;

    constructor(params: {
        id?: number;
        nombre: string;
        descripcion?: string | null;
        codigo: string;
        fechaCreacion?: Date;
        idUsuarioCreacion?: number | null;
        fechaModificacion?: Date | null;
        idUsuarioModificacion?: number | null;
        activo?: boolean;
    }) {
        this.validarNombre(params.nombre);
        this.validarCodigo(params.codigo);

        this._id = params.id;
        this._nombre = params.nombre.trim();
        this._descripcion = params.descripcion?.trim() || null;
        this._codigo = params.codigo.trim();
        this._fechaCreacion = params.fechaCreacion || new Date();
        this._idUsuarioCreacion = params.idUsuarioCreacion || null;
        this._fechaModificacion = params.fechaModificacion || null;
        this._idUsuarioModificacion = params.idUsuarioModificacion || null;
        this._activo = params.activo !== undefined ? params.activo : true;
    }

    // Getters
    get id(): number {
        if (this._id === undefined) {
            throw new Error('El permiso no ha sido persistido aún');
        }
        return this._id;
    }

    get nombre(): string { return this._nombre; }
    get descripcion(): string | null { return this._descripcion; }
    get codigo(): string { return this._codigo; }
    get fechaCreacion(): Date { return this._fechaCreacion; }
    get idUsuarioCreacion(): number | null { return this._idUsuarioCreacion; }
    get fechaModificacion(): Date | null { return this._fechaModificacion; }
    get idUsuarioModificacion(): number | null { return this._idUsuarioModificacion; }
    get activo(): boolean { return this._activo; }

    // Métodos de negocio
    actualizar(datos: {
        nombre?: string;
        descripcion?: string;
        codigo?: string;
        idUsuarioModificacion: number;
    }): void {
        let huboCambios = false;

        if (datos.nombre && datos.nombre !== this._nombre) {
            this.validarNombre(datos.nombre);
            this._nombre = datos.nombre.trim();
            huboCambios = true;
        }

        if (datos.codigo && datos.codigo !== this._codigo) {
            this.validarCodigo(datos.codigo);
            this._codigo = datos.codigo.trim();
            huboCambios = true;
        }

        if (datos.descripcion !== undefined && datos.descripcion !== this._descripcion) {
            this._descripcion = datos.descripcion?.trim() || null;
            huboCambios = true;
        }

        if (huboCambios) {
            this._fechaModificacion = new Date();
            this._idUsuarioModificacion = datos.idUsuarioModificacion;
        }
    }

    desactivar(idUsuarioModificacion: number): void {
        if (!this._activo) {
            throw new Error('El permiso ya está desactivado');
        }
        this._activo = false;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    activar(idUsuarioModificacion: number): void {
        if (this._activo) {
            throw new Error('El permiso ya está activo');
        }
        this._activo = true;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    private validarNombre(nombre: string): void {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre del permiso es requerido');
        }
        if (nombre.trim().length < 2) {
            throw new Error('El nombre del permiso debe tener al menos 2 caracteres');
        }
        if (nombre.trim().length > 50) {
            throw new Error('El nombre del permiso no puede exceder 50 caracteres');
        }
        const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_]+$/;
        if (!caracteresPermitidos.test(nombre.trim())) {
            throw new Error('El nombre del permiso contiene caracteres no permitidos');
        }
    }

    private validarCodigo(codigo: string): void {
        if (!codigo || codigo.trim().length === 0) {
            throw new Error('El código del permiso es requerido');
        }
        if (codigo.trim().length < 2) {
            throw new Error('El código del permiso debe tener al menos 2 caracteres');
        }
        if (codigo.trim().length > 50) {
            throw new Error('El código del permiso no puede exceder 50 caracteres');
        }
        const caracteresPermitidos = /^[a-zA-Z0-9\-_.]+$/;
        if (!caracteresPermitidos.test(codigo.trim())) {
            throw new Error('El código del permiso solo puede contener letras, números, guiones, puntos y guiones bajos');
        }
    }

    puedeSerModificado(): boolean {
        return this._activo;
    }

    toString(): string {
        return `Permiso[id=${this._id}, codigo=${this._codigo}, nombre=${this._nombre}, activo=${this._activo}]`;
    }
}