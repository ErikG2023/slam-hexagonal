import { SesionDatosInvalidosException } from '../excepciones/autenticacion-domain.exception';

export enum EstadoSesion {
    ACTIVA = 'ACTIVA',
    EXPIRADA = 'EXPIRADA',
    CERRADA = 'CERRADA'
}

export class Sesion {
    private _id: string | undefined;
    private _idUsuario: number;
    private _tokenHash: string;
    private _ipAddress: string;
    private _userAgent: string;
    private _fechaCreacion: Date;
    private _fechaExpiracion: Date;
    private _ultimaActividad: Date;
    private _estado: EstadoSesion;
    private _deviceId: string | null;
    private _deviceName: string | null;

    constructor(params: {
        id?: string;
        idUsuario: number;
        tokenHash: string;
        ipAddress: string;
        userAgent: string;
        fechaCreacion?: Date;
        fechaExpiracion: Date;
        ultimaActividad?: Date;
        estado?: EstadoSesion;
        deviceId?: string | null;
        deviceName?: string | null;
    }) {
        this.validarParametros(params);

        this._id = params.id;
        this._idUsuario = params.idUsuario;
        this._tokenHash = params.tokenHash;
        this._ipAddress = params.ipAddress.trim();
        this._userAgent = params.userAgent.trim();
        this._fechaCreacion = params.fechaCreacion || new Date();
        this._fechaExpiracion = new Date(params.fechaExpiracion);
        this._ultimaActividad = params.ultimaActividad || new Date();
        this._estado = params.estado || EstadoSesion.ACTIVA;
        this._deviceId = params.deviceId?.trim() || null;
        this._deviceName = params.deviceName?.trim() || null;
    }

    // Getters
    get id(): string {
        if (this._id === undefined) {
            throw new Error('La sesión no ha sido persistida aún');
        }
        return this._id;
    }

    get idUsuario(): number { return this._idUsuario; }
    get tokenHash(): string { return this._tokenHash; }
    get ipAddress(): string { return this._ipAddress; }
    get userAgent(): string { return this._userAgent; }
    get fechaCreacion(): Date { return this._fechaCreacion; }
    get fechaExpiracion(): Date { return this._fechaExpiracion; }
    get ultimaActividad(): Date { return this._ultimaActividad; }
    get estado(): EstadoSesion { return this._estado; }
    get deviceId(): string | null { return this._deviceId; }
    get deviceName(): string | null { return this._deviceName; }

    // Métodos de negocio
    actualizarActividad(): void {
        if (this._estado !== EstadoSesion.ACTIVA) {
            throw new SesionDatosInvalidosException('No se puede actualizar actividad de una sesión no activa');
        }

        if (this.estaExpirada()) {
            this.marcarComoExpirada();
            throw new SesionDatosInvalidosException('La sesión ha expirado automáticamente');
        }

        this._ultimaActividad = new Date();
    }

    cerrar(): void {
        if (this._estado === EstadoSesion.CERRADA) {
            throw new SesionDatosInvalidosException('La sesión ya está cerrada');
        }

        this._estado = EstadoSesion.CERRADA;
        this._ultimaActividad = new Date();
    }

    marcarComoExpirada(): void {
        if (this._estado === EstadoSesion.CERRADA) {
            throw new SesionDatosInvalidosException('No se puede marcar como expirada una sesión cerrada');
        }

        this._estado = EstadoSesion.EXPIRADA;
    }

    // Validaciones
    estaActiva(): boolean {
        return this._estado === EstadoSesion.ACTIVA && !this.estaExpirada();
    }

    estaExpirada(): boolean {
        return new Date() > this._fechaExpiracion;
    }

    puedeSerUsada(): boolean {
        return this.estaActiva();
    }

    // Información de la sesión
    tiempoRestante(): number {
        if (!this.estaActiva()) return 0;

        const ahora = new Date().getTime();
        const expiracion = this._fechaExpiracion.getTime();
        const diferencia = expiracion - ahora;

        return Math.max(0, Math.floor(diferencia / 1000 / 60)); // minutos
    }

    private validarParametros(params: any): void {
        if (!params.idUsuario || params.idUsuario <= 0) {
            throw new SesionDatosInvalidosException('ID de usuario es requerido y debe ser mayor a 0');
        }

        if (!params.tokenHash || params.tokenHash.trim().length === 0) {
            throw new SesionDatosInvalidosException('Hash del token es requerido');
        }

        if (!params.ipAddress || params.ipAddress.trim().length === 0) {
            throw new SesionDatosInvalidosException('Dirección IP es requerida');
        }

        if (!params.userAgent || params.userAgent.trim().length === 0) {
            throw new SesionDatosInvalidosException('User Agent es requerido');
        }

        if (!params.fechaExpiracion) {
            throw new SesionDatosInvalidosException('Fecha de expiración es requerida');
        }

        const expiracion = new Date(params.fechaExpiracion);
        const ahora = new Date();

        if (expiracion <= ahora) {
            throw new SesionDatosInvalidosException('Fecha de expiración debe ser futura');
        }
    }

    toString(): string {
        return `Sesion[id=${this._id}, idUsuario=${this._idUsuario}, estado=${this._estado}, expira=${this._fechaExpiracion.toISOString()}]`;
    }
}