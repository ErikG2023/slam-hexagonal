import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, Not } from 'typeorm';
import { RolRepositorio } from '../../../../../dominio/puertos/repositorios/rol-repositorio.interface';
import { Rol } from '../../../../../dominio/entidades/rol.entity';
import { RolOrmEntity } from './entidades/rol.orm-entity';
import { RolMapper } from '../mappers/rol.mapper';

@Injectable() // Este decorador permite que NestJS inyecte dependencias automáticamente
export class TypeOrmRolRepository implements RolRepositorio {
    constructor(
        @InjectRepository(RolOrmEntity)
        private readonly rolRepository: Repository<RolOrmEntity>,
    ) { }

    async guardar(rol: Rol): Promise<Rol> {
        try {
            // Convertimos la entidad de dominio a entidad ORM
            const rolOrm = RolMapper.toOrm(rol);

            // TypeORM determina automáticamente si debe hacer INSERT o UPDATE
            const rolGuardado = await this.rolRepository.save(rolOrm);

            // Convertimos el resultado de vuelta a entidad de dominio
            return RolMapper.toDomain(rolGuardado);
        } catch (error) {
            // Transformamos errores de base de datos a errores de dominio más comprensibles
            if (error.code === '23505') { // Código de PostgreSQL para violación de restricción única
                throw new Error(`Ya existe un rol con el nombre especificado`);
            }
            throw new Error(`Error al guardar el rol: ${error.message}`);
        }
    }

    async buscarPorId(id: number): Promise<Rol | null> {
        const rolOrm = await this.rolRepository.findOne({
            where: { id }
        });

        return rolOrm ? RolMapper.toDomain(rolOrm) : null;
    }

    async buscarTodos(filtros: {
        activo?: boolean;
        nombre?: string;
        limite?: number;
        offset?: number;
    } = {}): Promise<Rol[]> {
        // Construimos dinámicamente las condiciones de búsqueda
        const whereConditions: any = {};

        if (filtros.activo !== undefined) {
            whereConditions.activo = filtros.activo;
        }

        if (filtros.nombre) {
            // Búsqueda parcial insensible a mayúsculas/minúsculas
            whereConditions.nombre = Like(`%${filtros.nombre}%`);
        }

        const rolesOrm = await this.rolRepository.find({
            where: whereConditions,
            take: filtros.limite || 10, // Limitamos resultados para evitar problemas de rendimiento
            skip: filtros.offset || 0,
            order: {
                nombre: 'ASC', // Ordenamos alfabéticamente por defecto
            },
        });

        return RolMapper.toDomainArray(rolesOrm);
    }

    async eliminar(id: number, idUsuarioEjecutor: number): Promise<void> {
        // Implementamos soft delete actualizando el campo 'activo'
        // Esto preserva los datos para auditoría mientras los marca como eliminados
        const resultado = await this.rolRepository.update(id, {
            activo: false,
            fechaModificacion: new Date(),
            idUsuarioModificacion: idUsuarioEjecutor,
        });

        if (resultado.affected === 0) {
            throw new Error(`No se pudo eliminar el rol con ID ${id}. Puede que no exista.`);
        }
    }

    async restaurar(id: number, idUsuarioEjecutor: number): Promise<void> {
        // Implementamos la restauración de un rol eliminado
        const resultado = await this.rolRepository.update(id, {
            activo: true,
            fechaModificacion: new Date(),
            idUsuarioModificacion: idUsuarioEjecutor,
        });

        if (resultado.affected === 0) {
            throw new Error(`No se pudo restaurar el rol con ID ${id}. Puede que no exista.`);
        }
    }

    // Implementación de las validaciones centralizadas que mencionaste anteriormente
    async existeConNombre(nombre: string, idExcluir?: number): Promise<boolean> {
        const whereConditions: any = {
            nombre: nombre.trim(),
            activo: true, // Solo consideramos roles activos para validación de unicidad
        };

        // Si estamos actualizando un rol, excluimos su propio ID de la búsqueda
        if (idExcluir) {
            whereConditions.id = Not(idExcluir);
        }

        const count = await this.rolRepository.count({
            where: whereConditions
        });

        return count > 0;
    }

    async existeYEstaActivo(id: number): Promise<boolean> {
        const count = await this.rolRepository.count({
            where: {
                id,
                activo: true
            }
        });

        return count > 0;
    }

    async puedeSerEliminado(id: number): Promise<{
        puedeEliminarse: boolean;
        razon?: string;
        dependencias?: string[];
    }> {
        const dependencias: string[] = [];

        // La única validación crítica: usuarios activos con este rol
        // Nota importante: No validamos usuarios bloqueados porque:
        // 1. Los usuarios bloqueados no pueden operar en el sistema
        // 2. Si desbloqueamos un usuario y su rol fue eliminado, podemos restaurar el rol
        // 3. Los usuarios bloqueados mantienen su relación con el rol en la BD
        const usuariosActivosConEsteRol = await this.rolRepository.manager.count('usuario', {
            where: {
                idRol: id,
                activo: true  // Solo usuarios activos importan para funcionalidad
                // Deliberadamente NO filtramos por 'bloqueado' porque como dices, no importa
            }
        });

        if (usuariosActivosConEsteRol > 0) {
            // Mensaje claro que explica exactamente por qué no se puede eliminar
            dependencias.push(`${usuariosActivosConEsteRol} usuario(s) activo(s) dependen de este rol para funcionar`);
        }

        // Si hay usuarios activos, explican claramente la razón operacional
        if (dependencias.length > 0) {
            return {
                puedeEliminarse: false,
                razon: `No se puede desactivar el rol porque interrumpiría el funcionamiento de usuarios activos`,
                dependencias
            };
        }

        // Si no hay usuarios activos, el rol se puede eliminar sin problemas operacionales
        return { puedeEliminarse: true };
    }

    async contarRegistros(filtros: { activo?: boolean } = {}): Promise<number> {
        const whereConditions: any = {};

        if (filtros.activo !== undefined) {
            whereConditions.activo = filtros.activo;
        }

        return await this.rolRepository.count({
            where: whereConditions
        });
    }
}