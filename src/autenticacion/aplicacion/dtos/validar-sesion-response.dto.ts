export class UsuarioSesionDto {
    id: number;
    username: string;
    nombreCompleto: string;
    email: string;
    rol: string;

    constructor(usuario: any) {
        this.id = usuario.id;
        this.username = usuario.username;
        this.nombreCompleto = usuario.nombreCompleto;
        this.email = usuario.email;
        this.rol = usuario.rol;
    }
}

export class InfoSesionDto {
    id: string;
    expiresAt: string;
    lastActivity: string;
    tiempoRestante: number; // en minutos
    ipAddress: string;
    deviceName: string | null;

    constructor(sesion: any) {
        this.id = sesion.id;
        this.expiresAt = sesion.fechaExpiracion.toISOString();
        this.lastActivity = sesion.ultimaActividad.toISOString();
        this.tiempoRestante = sesion.tiempoRestante();
        this.ipAddress = sesion.ipAddress;
        this.deviceName = sesion.deviceName;
    }
}

export class ValidarSesionResponseDto {
    valid: boolean;
    usuario?: UsuarioSesionDto;
    session?: InfoSesionDto;
    reason?: string;

    constructor(data: {
        valida: boolean;
        usuario?: any;
        sesion?: any;
        razon?: string;
    }) {
        this.valid = data.valida;

        if (data.usuario) {
            this.usuario = new UsuarioSesionDto(data.usuario);
        }

        if (data.sesion) {
            this.session = new InfoSesionDto(data.sesion);
        }

        if (data.razon) {
            this.reason = data.razon;
        }
    }
}