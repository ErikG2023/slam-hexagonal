export class RolRespuestaDto {
    id: number;
    nombre: string;
    descripcion: string | null;
    fechaCreacion: string; // Usamos string para tener control total sobre el formato de fecha
    idUsuarioCreacion: number | null;
    fechaModificacion: string | null;
    idUsuarioModificacion: number | null;
    activo: boolean;

    constructor(rol: any) {
        this.id = rol.id;
        this.nombre = rol.nombre;
        this.descripcion = rol.descripcion;
        // Formateamos las fechas de manera consistente
        this.fechaCreacion = rol.fechaCreacion.toISOString();
        this.idUsuarioCreacion = rol.idUsuarioCreacion;
        this.fechaModificacion = rol.fechaModificacion?.toISOString() || null;
        this.idUsuarioModificacion = rol.idUsuarioModificacion;
        this.activo = rol.activo;
    }
}