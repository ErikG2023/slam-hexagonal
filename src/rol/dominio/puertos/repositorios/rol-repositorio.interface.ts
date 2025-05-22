import { Rol } from '../../entidades/rol.entity';

// Esta interfaz define QUÉ necesita nuestro dominio, no CÓMO se implementa
export interface RolRepositorio {
    // Operaciones básicas CRUD
    guardar(rol: Rol): Promise<Rol>;
    buscarPorId(id: number): Promise<Rol | null>;
    buscarTodos(filtros?: {
        activo?: boolean;
        nombre?: string;
        limite?: number;
        offset?: number;
    }): Promise<Rol[]>;
    eliminar(id: number, idUsuarioEjecutor: number): Promise<void>;
    restaurar(id: number, idUsuarioEjecutor: number): Promise<void>;

    // Validaciones específicas que mencionaste
    existeConNombre(nombre: string, idExcluir?: number): Promise<boolean>;
    existeYEstaActivo(id: number): Promise<boolean>;
    puedeSerEliminado(id: number): Promise<{
        puedeEliminarse: boolean;
        razon?: string;
        dependencias?: string[];
    }>;
    contarRegistros(filtros?: { activo?: boolean }): Promise<number>;
}