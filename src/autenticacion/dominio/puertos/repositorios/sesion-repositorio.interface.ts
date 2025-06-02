import { Sesion, EstadoSesion } from '../../entidades/sesion.entity';

// Interfaces para datos enriquecidos
export interface SesionConDetalles {
    id: string;
    idUsuario: number;
    tokenHash: string;
    ipAddress: string;
    userAgent: string;
    fechaCreacion: Date;
    fechaExpiracion: Date;
    ultimaActividad: Date;
    estado: EstadoSesion;
    deviceId: string | null;
    deviceName: string | null;
    // Datos del usuario
    username: string;
    nombreCompleto: string;
    nombreRol: string;
}

export interface FiltrosSesiones {
    idUsuario?: number;
    estado?: EstadoSesion;
    ipAddress?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    limite?: number;
    offset?: number;
}

export interface SesionRepositorio {
    // Operaciones básicas CRUD
    guardar(sesion: Sesion): Promise<Sesion>;
    buscarPorId(id: string): Promise<Sesion | null>;
    buscarPorTokenHash(tokenHash: string): Promise<Sesion | null>;
    buscarTodas(filtros?: FiltrosSesiones): Promise<Sesion[]>;
    eliminar(id: string): Promise<void>;

    // Operaciones específicas para sesiones
    buscarConDetalles(id: string): Promise<SesionConDetalles | null>;
    listarConDetalles(filtros?: FiltrosSesiones): Promise<SesionConDetalles[]>;

    // Gestión de sesiones por usuario
    buscarSesionesActivasDeUsuario(idUsuario: number): Promise<Sesion[]>;
    contarSesionesActivasDeUsuario(idUsuario: number): Promise<number>;
    cerrarSesionesDeUsuario(idUsuario: number, excepto?: string): Promise<void>;
    cerrarSesionMasAntigua(idUsuario: number): Promise<void>;

    // Limpieza y mantenimiento
    marcarSesionesExpiradas(): Promise<number>;
    eliminarSesionesExpiradas(diasAntiguedad: number): Promise<number>;

    // Validaciones
    existeSesionActiva(id: string): Promise<boolean>;
    usuarioTieneSesionesActivas(idUsuario: number): Promise<boolean>;

    // Métricas y conteo
    contarRegistros(filtros?: { estado?: EstadoSesion; idUsuario?: number }): Promise<number>;
}