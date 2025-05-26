export class UsuarioRespuestaDto {
    id: number;
    idPersona: number;
    idRol: number;
    username: string;
    bloqueado: boolean;
    ultimoAcceso: string | null;
    fechaCreacion: string;
    idUsuarioCreacion: number | null;
    fechaModificacion: string | null;
    idUsuarioModificacion: number | null;
    activo: boolean;

    constructor(usuario: any) {
        this.id = usuario.id;
        this.idPersona = usuario.idPersona;
        this.idRol = usuario.idRol;
        this.username = usuario.username;
        this.bloqueado = usuario.bloqueado;
        this.ultimoAcceso = usuario.ultimoAcceso?.toISOString() || null;
        this.fechaCreacion = usuario.fechaCreacion.toISOString();
        this.idUsuarioCreacion = usuario.idUsuarioCreacion;
        this.fechaModificacion = usuario.fechaModificacion?.toISOString() || null;
        this.idUsuarioModificacion = usuario.idUsuarioModificacion;
        this.activo = usuario.activo;
    }
}