import { RolPermiso } from '../../entidades/rol-permiso.entity';

// Interfaces específicas para los casos de uso frontend-oriented
export interface PermisoConDetalles {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string | null; // Cambiado para aceptar null
}

export interface RolConDetalles {
    id: number;
    nombre: string;
    descripcion?: string | null; // Cambiado para aceptar null
}

export interface GestionPermisosRol {
    rol: RolConDetalles;
    permisosAsignados: PermisoConDetalles[];
    permisosDisponibles: PermisoConDetalles[];
}

export interface RolPermisoRepositorio {
    // Operaciones básicas CRUD
    guardar(rolPermiso: RolPermiso): Promise<RolPermiso>;
    buscarPorRolYPermiso(idRol: number, idPermiso: number): Promise<RolPermiso | null>;
    eliminar(idRol: number, idPermiso: number, idUsuarioEjecutor: number): Promise<void>;

    // Operaciones específicas para frontend
    obtenerGestionPermisosDeRol(idRol: number): Promise<GestionPermisosRol>;
    obtenerPermisosAsignadosDeRol(idRol: number): Promise<PermisoConDetalles[]>;
    obtenerPermisosDisponiblesParaRol(idRol: number): Promise<PermisoConDetalles[]>;

    // Sincronización completa (para el botón "Guardar")
    sincronizarPermisosDeRol(
        idRol: number,
        idsPermisosDeseados: number[],
        idUsuarioEjecutor: number
    ): Promise<void>;

    // Validaciones
    existeAsignacion(idRol: number, idPermiso: number): Promise<boolean>;
    rolExisteYEstaActivo(idRol: number): Promise<boolean>;
    permisoExisteYEstaActivo(idPermiso: number): Promise<boolean>;
    validarPermisosExistenYActivos(idsPermisos: number[]): Promise<{
        validos: number[];
        invalidos: number[];
    }>;
}