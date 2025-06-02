import { Usuario } from '../../entidades/usuario.entity';

// Interfaces para datos enriquecidos
export interface UsuarioConDetalles {
    id: number;
    idPersona: number;
    idRol: number;
    username: string;
    bloqueado: boolean;
    ultimoAcceso: Date | null;
    fechaCreacion: Date;
    activo: boolean;
    // Datos de la persona
    nombreCompleto: string;
    email: string;
    rut: string;
    // Datos del rol
    nombreRol: string;
    descripcionRol: string | null;
}


export interface UsuarioRepositorio {
    // Operaciones básicas CRUD
    guardar(usuario: Usuario): Promise<Usuario>;
    buscarPorId(id: number): Promise<Usuario | null>;
    buscarPorUsername(username: string): Promise<Usuario | null>;
    buscarTodos(filtros?: {
        activo?: boolean;
        bloqueado?: boolean;
        idRol?: number;
        username?: string;
        limite?: number;
        offset?: number;
    }): Promise<Usuario[]>;
    eliminar(id: number, idUsuarioEjecutor: number): Promise<void>;
    restaurar(id: number, idUsuarioEjecutor: number): Promise<void>;

    // Operaciones específicas para usuarios
    buscarConDetalles(id: number): Promise<UsuarioConDetalles | null>;
    listarConDetalles(filtros?: {
        activo?: boolean;
        bloqueado?: boolean;
        idRol?: number;
        username?: string;
        limite?: number;
        offset?: number;
    }): Promise<UsuarioConDetalles[]>;

    // Validaciones específicas
    existeConUsername(username: string, idExcluir?: number): Promise<boolean>;
    existeYEstaActivo(id: number): Promise<boolean>;
    personaYaTieneUsuario(idPersona: number, idExcluir?: number): Promise<boolean>;
    personaExisteYEstaActiva(idPersona: number): Promise<boolean>;
    rolExisteYEstaActivo(idRol: number): Promise<boolean>;
    puedeSerEliminado(id: number): Promise<{
        puedeEliminarse: boolean;
        razon?: string;
        dependencias?: string[];
    }>;
    contarRegistros(filtros?: { activo?: boolean; bloqueado?: boolean }): Promise<number>;

    // Operaciones de autenticación
    actualizarUltimoAcceso(id: number): Promise<void>;
    
}

