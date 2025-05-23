import { Permiso } from '../../entidades/permiso.entity';

// Esta interfaz define QUÉ necesita nuestro dominio, no CÓMO se implementa
export interface PermisoRepositorio {
    // Operaciones básicas CRUD
    guardar(permiso: Permiso): Promise<Permiso>;
    buscarPorId(id: number): Promise<Permiso | null>;
    buscarTodos(filtros?: {
        activo?: boolean;
        nombre?: string;
        codigo?: string;
        limite?: number;
        offset?: number;
    }): Promise<Permiso[]>;
    eliminar(id: number, idUsuarioEjecutor: number): Promise<void>;
    restaurar(id: number, idUsuarioEjecutor: number): Promise<void>;

    // Validaciones específicas
    existeConNombre(nombre: string, idExcluir?: number): Promise<boolean>;
    existeConCodigo(codigo: string, idExcluir?: number): Promise<boolean>;
    existeYEstaActivo(id: number): Promise<boolean>;
    puedeSerEliminado(id: number): Promise<{
        puedeEliminarse: boolean;
        razon?: string;
        dependencias?: string[];
    }>;
    contarRegistros(filtros?: { activo?: boolean }): Promise<number>;
}