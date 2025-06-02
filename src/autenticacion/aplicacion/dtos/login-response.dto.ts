export class UsuarioLoginDto {
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

export class SesionLoginDto {
    id: string;
    fechaCreacion: string;
    fechaExpiracion: string;
    ipAddress: string;
    deviceName: string | null;

    constructor(sesion: any) {
        this.id = sesion.id;
        this.fechaCreacion = sesion.fechaCreacion.toISOString();
        this.fechaExpiracion = sesion.fechaExpiracion.toISOString();
        this.ipAddress = sesion.ipAddress;
        this.deviceName = sesion.deviceName;
    }
}

export class LoginResponseDto {
    success: boolean;
    token: string;
    tokenType: string;
    expiresAt: string;
    usuario: UsuarioLoginDto;
    sesion: SesionLoginDto;
    mensaje: string;

    constructor(data: {
        token: string;
        expiresAt: Date;
        usuario: any;
        sesion: any;
    }) {
        this.success = true;
        this.token = data.token;
        this.tokenType = 'Bearer';
        this.expiresAt = data.expiresAt.toISOString();
        this.usuario = new UsuarioLoginDto(data.usuario);
        this.sesion = new SesionLoginDto(data.sesion);
        this.mensaje = `Bienvenido, ${data.usuario.nombreCompleto}`;
    }
}