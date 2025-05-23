export class PermisoRespuestaDto {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string | null;
    fechaCreacion: string; // Usamos string para tener control total sobre el formato de fecha
    idUsuarioCreacion: number | null;
    fechaModificacion: string | null;
    idUsuarioModificacion: number | null;
    activo: boolean;

    constructor(permiso: any) {
        this.id = permiso.id;
        this.nombre = permiso.nombre;
        this.codigo = permiso.codigo;
        this.descripcion = permiso.descripcion;
        // Formateamos las fechas de manera consistente
        this.fechaCreacion = permiso.fechaCreacion.toISOString();
        this.idUsuarioCreacion = permiso.idUsuarioCreacion;
        this.fechaModificacion = permiso.fechaModificacion?.toISOString() || null;
        this.idUsuarioModificacion = permiso.idUsuarioModificacion;
        this.activo = permiso.activo;
    }
}