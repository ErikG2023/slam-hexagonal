export class PermisoDetalleDto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string | null; // Cambiado para consistencia

    constructor(permiso: any) {
        this.id = permiso.id;
        this.codigo = permiso.codigo;
        this.nombre = permiso.nombre;
        this.descripcion = permiso.descripcion;
    }
}

export class RolDetalleDto {
    id: number;
    nombre: string;
    descripcion: string | null; // Cambiado para consistencia

    constructor(rol: any) {
        this.id = rol.id;
        this.nombre = rol.nombre;
        this.descripcion = rol.descripcion;
    }
}

export class GestionPermisosRolDto {
    rol: RolDetalleDto;
    permisosAsignados: PermisoDetalleDto[];
    permisosDisponibles: PermisoDetalleDto[];
    totalPermisosAsignados: number;
    totalPermisosDisponibles: number;

    constructor(data: {
        rol: any;
        permisosAsignados: any[];
        permisosDisponibles: any[];
    }) {
        this.rol = new RolDetalleDto(data.rol);
        this.permisosAsignados = data.permisosAsignados.map(p => new PermisoDetalleDto(p));
        this.permisosDisponibles = data.permisosDisponibles.map(p => new PermisoDetalleDto(p));
        this.totalPermisosAsignados = this.permisosAsignados.length;
        this.totalPermisosDisponibles = this.permisosDisponibles.length;
    }
}