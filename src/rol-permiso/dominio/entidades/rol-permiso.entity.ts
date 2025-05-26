export class RolPermiso {
    private _id: number | undefined;
    private _idRol: number;
    private _idPermiso: number;
    private _fechaCreacion: Date;
    private _idUsuarioCreacion: number | null;
    private _fechaModificacion: Date | null;
    private _idUsuarioModificacion: number | null;
    private _activo: boolean;

    constructor(params: {
        id?: number;
        idRol: number;
        idPermiso: number;
        fechaCreacion?: Date;
        idUsuarioCreacion?: number | null;
        fechaModificacion?: Date | null;
        idUsuarioModificacion?: number | null;
        activo?: boolean;
    }) {
        this.validarIdRol(params.idRol);
        this.validarIdPermiso(params.idPermiso);

        this._id = params.id;
        this._idRol = params.idRol;
        this._idPermiso = params.idPermiso;
        this._fechaCreacion = params.fechaCreacion || new Date();
        this._idUsuarioCreacion = params.idUsuarioCreacion || null;
        this._fechaModificacion = params.fechaModificacion || null;
        this._idUsuarioModificacion = params.idUsuarioModificacion || null;
        this._activo = params.activo !== undefined ? params.activo : true;
    }

    // Getters
    get id(): number {
        if (this._id === undefined) {
            throw new Error('La asignación rol-permiso no ha sido persistida aún');
        }
        return this._id;
    }

    get idRol(): number { return this._idRol; }
    get idPermiso(): number { return this._idPermiso; }
    get fechaCreacion(): Date { return this._fechaCreacion; }
    get idUsuarioCreacion(): number | null { return this._idUsuarioCreacion; }
    get fechaModificacion(): Date | null { return this._fechaModificacion; }
    get idUsuarioModificacion(): number | null { return this._idUsuarioModificacion; }
    get activo(): boolean { return this._activo; }

    // Métodos de negocio
    desactivar(idUsuarioModificacion: number): void {
        if (!this._activo) {
            throw new Error('La asignación rol-permiso ya está desactivada');
        }
        this._activo = false;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    activar(idUsuarioModificacion: number): void {
        if (this._activo) {
            throw new Error('La asignación rol-permiso ya está activa');
        }
        this._activo = true;
        this._fechaModificacion = new Date();
        this._idUsuarioModificacion = idUsuarioModificacion;
    }

    private validarIdRol(idRol: number): void {
        if (!idRol || idRol <= 0) {
            throw new Error('El ID del rol es requerido y debe ser mayor a 0');
        }
    }

    private validarIdPermiso(idPermiso: number): void {
        if (!idPermiso || idPermiso <= 0) {
            throw new Error('El ID del permiso es requerido y debe ser mayor a 0');
        }
    }

    toString(): string {
        return `RolPermiso[id=${this._id}, idRol=${this._idRol}, idPermiso=${this._idPermiso}, activo=${this._activo}]`;
    }
}