import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { PermisoRepositorio } from '../../../../../dominio/puertos/repositorios/permiso-repositorio.interface';
import { Permiso } from '../../../../../dominio/entidades/permiso.entity';
import { PermisoOrmEntity } from './entidades/permiso.orm-entity';
import { PermisoMapper } from '../mappers/permiso.mapper';

@Injectable()
export class TypeOrmPermisoRepository implements PermisoRepositorio {
    constructor(
        @InjectRepository(PermisoOrmEntity)
        private readonly permisoRepository: Repository<PermisoOrmEntity>,
    ) { }

    async guardar(permiso: Permiso): Promise<Permiso> {
        try {
            // Convertimos la entidad de dominio a entidad ORM
            const permisoOrm = PermisoMapper.toOrm(permiso);

            // TypeORM determina automáticamente si debe hacer INSERT o UPDATE
            const permisoGuardado = await this.permisoRepository.save(permisoOrm);

            // Convertimos el resultado de vuelta a entidad de dominio
            return PermisoMapper.toDomain(permisoGuardado);
        } catch (error) {
            // Transformamos errores de base de datos a errores de dominio más comprensibles
            if (error.code === '23505') { // Código de PostgreSQL para violación de restricción única
                if (error.constraint?.includes('nombre')) {
                    throw new Error(`Ya existe un permiso con el nombre especificado`);
                }
                if (error.constraint?.includes('codigo')) {
                    throw new Error(`Ya existe un permiso con el código especificado`);
                }
                throw new Error(`Ya existe un permiso con los datos especificados`);
            }
            throw new Error(`Error al guardar el permiso: ${error.message}`);
        }
    }

    async buscarPorId(id: number): Promise<Permiso | null> {
        const permisoOrm = await this.permisoRepository.findOne({
            where: { id }
        });

        return permisoOrm ? PermisoMapper.toDomain(permisoOrm) : null;
    }

    async buscarTodos(filtros: {
        activo?: boolean;
        nombre?: string;
        codigo?: string;
        limite?: number;
        offset?: number;
    } = {}): Promise<Permiso[]> {
        // Construimos dinámicamente las condiciones de búsqueda
        const whereConditions: any = {};

        if (filtros.activo !== undefined) {
            whereConditions.activo = filtros.activo;
        }

        if (filtros.nombre) {
            // Búsqueda parcial insensible a mayúsculas/minúsculas
            whereConditions.nombre = Like(`%${filtros.nombre}%`);
        }

        if (filtros.codigo) {
            // Búsqueda parcial insensible a mayúsculas/minúsculas
            whereConditions.codigo = Like(`%${filtros.codigo}%`);
        }

        const permisosOrm = await this.permisoRepository.find({
            where: whereConditions,
            take: filtros.limite || 10,
            skip: filtros.offset || 0,
            order: {
                codigo: 'ASC', // Ordenamos por código alfabéticamente por defecto
            },
        });

        return PermisoMapper.toDomainArray(permisosOrm);
    }

    async eliminar(id: number, idUsuarioEjecutor: number): Promise<void> {
        // Implementamos soft delete actualizando el campo 'activo'
        const resultado = await this.permisoRepository.update(id, {
            activo: false,
            fechaModificacion: new Date(),
            idUsuarioModificacion: idUsuarioEjecutor,
        });

        if (resultado.affected === 0) {
            throw new Error(`No se pudo eliminar el permiso con ID ${id}. Puede que no exista.`);
        }
    }

    async restaurar(id: number, idUsuarioEjecutor: number): Promise<void> {
        // Implementamos la restauración de un permiso eliminado
        const resultado = await this.permisoRepository.update(id, {
            activo: true,
            fechaModificacion: new Date(),
            idUsuarioModificacion: idUsuarioEjecutor,
        });

        if (resultado.affected === 0) {
            throw new Error(`No se pudo restaurar el permiso con ID ${id}. Puede que no exista.`);
        }
    }

    async existeConNombre(nombre: string, idExcluir?: number): Promise<boolean> {
        const whereConditions: any = {
            nombre: nombre.trim(),
            activo: true, // Solo consideramos permisos activos para validación de unicidad
        };

        // Si estamos actualizando un permiso, excluimos su propio ID de la búsqueda
        if (idExcluir) {
            whereConditions.id = Not(idExcluir);
        }

        const count = await this.permisoRepository.count({
            where: whereConditions
        });

        return count > 0;
    }

    async existeConCodigo(codigo: string, idExcluir?: number): Promise<boolean> {
        const whereConditions: any = {
            codigo: codigo.trim(),
            activo: true, // Solo consideramos permisos activos para validación de unicidad
        };

        // Si estamos actualizando un permiso, excluimos su propio ID de la búsqueda
        if (idExcluir) {
            whereConditions.id = Not(idExcluir);
        }

        const count = await this.permisoRepository.count({
            where: whereConditions
        });

        return count > 0;
    }

    async existeYEstaActivo(id: number): Promise<boolean> {
        const count = await this.permisoRepository.count({
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
        // Aquí implementaríamos las validaciones de dependencias
        // Por ahora, permitimos eliminar cualquier permiso, pero en una implementación real
        // verificaríamos si hay roles asignados a este permiso, etc.

        // Ejemplo de cómo se vería una validación real:
        // const rolesConEstePermiso = await this.rolPermisoRepository.count({
        //   where: { idPermiso: id, activo: true }
        // });

        // if (rolesConEstePermiso > 0) {
        //   return {
        //     puedeEliminarse: false,
        //     razon: `Existen ${rolesConEstePermiso} roles asignados a este permiso`,
        //     dependencias: ['roles']
        //   };
        // }

        return {
            puedeEliminarse: true
        };
    }

    async contarRegistros(filtros: { activo?: boolean } = {}): Promise<number> {
        const whereConditions: any = {};

        if (filtros.activo !== undefined) {
            whereConditions.activo = filtros.activo;
        }

        return await this.permisoRepository.count({
            where: whereConditions
        });
    }
}