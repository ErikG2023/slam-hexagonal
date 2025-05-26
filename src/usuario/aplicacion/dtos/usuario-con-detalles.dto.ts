export class UsuarioConDetallesDto {
    id: number;
    idPersona: number;
    idRol: number;
    username: string;
    bloqueado: boolean;
    ultimoAcceso: string | null;
    fechaCreacion: string;
    activo: boolean;
    // Datos de la persona
    nombreCompleto: string;
    email: string;
    rut: string;
    // Datos del rol
    nombreRol: string;
    descripcionRol: string | null;

    constructor(usuario: any) {
        this.id = usuario.id;
        this.idPersona = usuario.idPersona;
        this.idRol = usuario.idRol;
        this.username = usuario.username;
        this.bloqueado = usuario.bloqueado;
        this.ultimoAcceso = usuario.ultimoAcceso?.toISOString() || null;
        this.fechaCreacion = usuario.fechaCreacion.toISOString();
        this.activo = usuario.activo;
        this.nombreCompleto = usuario.nombreCompleto;
        this.email = usuario.email;
        this.rut = usuario.rut;
        this.nombreRol = usuario.nombreRol;
        this.descripcionRol = usuario.descripcionRol;
    }
}