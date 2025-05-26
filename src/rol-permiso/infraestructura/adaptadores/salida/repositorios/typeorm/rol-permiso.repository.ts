import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolPermisoRepositorio, GestionPermisosRol, PermisoConDetalles, RolConDetalles } from '../../../../../dominio/puertos/repositorios/rol-permiso-repositorio.interface';
import { RolPermiso } from '../../../../../dominio/entidades/rol-permiso.entity';
import { RolPermisoOrmEntity } from './entidades/rol-permiso.orm-entity';
import { RolOrmEntity } from '../../../../../../rol/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';
import { PermisoOrmEntity } from '../../../../../../permiso/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/permiso.orm-entity';
import { RolPermisoMapper } from '../mappers/rol-permiso.mapper';

@Injectable()
export class TypeOrmRolPermisoRepository implements RolPermisoRepositorio {
    constructor(
        @InjectRepository(RolPermisoOrmEntity)
        private readonly rolPermisoRepository: Repository<RolPermisoOrmEntity>,
        @InjectRepository(RolOrmEntity)
        private readonly rolRepository: Repository<RolOrmEntity>,
        @InjectRepository(PermisoOrmEntity)
        private readonly permisoRepository: Repository<PermisoOrmEntity>,
    ) { }

    async guardar(rolPermiso: RolPermiso): Promise<RolPermiso> {
        try {
            const rolPermisoOrm = RolPermisoMapper.toOrm(rolPermiso);
            const rolPermisoGuardado = await this.rolPermisoRepository.save(rolPermisoOrm);
            return RolPermisoMapper.toDomain(rolPermisoGuardado);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error(`La asignación rol-permiso ya existe`);
            }
            throw new Error(`Error al guardar la asignación rol-permiso: ${error.message}`);
        }
    }

    async buscarPorRolYPermiso(idRol: number, idPermiso: number): Promise<RolPermiso | null> {
        const rolPermisoOrm = await this.rolPermisoRepository.findOne({
            where: { idRol, idPermiso }
        });

        return rolPermisoOrm ? RolPermisoMapper.toDomain(rolPermisoOrm) : null;
    }

    async eliminar(idRol: number, idPermiso: number, idUsuarioEjecutor: number): Promise<void> {
        const resultado = await this.rolPermisoRepository.update(
            { idRol, idPermiso },
            {
                activo: false,
                fechaModificacion: new Date(),
                idUsuarioModificacion: idUsuarioEjecutor,
            }
        );

        if (resultado.affected === 0) {
            throw new Error(`No se pudo eliminar la asignación rol ${idRol} - permiso ${idPermiso}`);
        }
    }

    async obtenerGestionPermisosDeRol(idRol: number): Promise<GestionPermisosRol> {
        // Obtener información del rol
        const rol = await this.rolRepository.findOne({
            where: { id: idRol, activo: true }
        });

        if (!rol) {
            throw new Error(`Rol con ID ${idRol} no encontrado o inactivo`);
        }

        // Obtener permisos asignados al rol
        const permisosAsignados = await this.permisoRepository
            .createQueryBuilder('permiso')
            .innerJoin('rol_permiso', 'rp', 'rp.id_permiso = permiso.id')
            .where('rp.id_rol = :idRol', { idRol })
            .andWhere('rp.activo = true')
            .andWhere('permiso.activo = true')
            .orderBy('permiso.codigo', 'ASC')
            .getMany();

        // Obtener permisos disponibles (no asignados al rol)
        const permisosDisponibles = await this.permisoRepository
            .createQueryBuilder('permiso')
            .leftJoin(
                'rol_permiso',
                'rp',
                'rp.id_permiso = permiso.id AND rp.id_rol = :idRol AND rp.activo = true',
                { idRol }
            )
            .where('permiso.activo = true')
            .andWhere('rp.id IS NULL')
            .orderBy('permiso.codigo', 'ASC')
            .getMany();

        return {
            rol: {
                id: rol.id,
                nombre: rol.nombre,
                descripcion: rol.descripcion
            },
            permisosAsignados: permisosAsignados.map(p => ({
                id: p.id,
                codigo: p.codigo,
                nombre: p.nombre,
                descripcion: p.descripcion
            })),
            permisosDisponibles: permisosDisponibles.map(p => ({
                id: p.id,
                codigo: p.codigo,
                nombre: p.nombre,
                descripcion: p.descripcion
            }))
        };
    }

    async obtenerPermisosAsignadosDeRol(idRol: number): Promise<PermisoConDetalles[]> {
        const permisos = await this.permisoRepository
            .createQueryBuilder('permiso')
            .innerJoin('rol_permiso', 'rp', 'rp.id_permiso = permiso.id')
            .where('rp.id_rol = :idRol', { idRol })
            .andWhere('rp.activo = true')
            .andWhere('permiso.activo = true')
            .orderBy('permiso.codigo', 'ASC')
            .getMany();

        return permisos.map(p => ({
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            descripcion: p.descripcion
        }));
    }

    async obtenerPermisosDisponiblesParaRol(idRol: number): Promise<PermisoConDetalles[]> {
        const permisos = await this.permisoRepository
            .createQueryBuilder('permiso')
            .leftJoin(
                'rol_permiso',
                'rp',
                'rp.id_permiso = permiso.id AND rp.id_rol = :idRol AND rp.activo = true',
                { idRol }
            )
            .where('permiso.activo = true')
            .andWhere('rp.id IS NULL')
            .orderBy('permiso.codigo', 'ASC')
            .getMany();

        return permisos.map(p => ({
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            descripcion: p.descripcion
        }));
    }

    async sincronizarPermisosDeRol(
        idRol: number,
        idsPermisosDeseados: number[],
        idUsuarioEjecutor: number
    ): Promise<void> {
        // Usar transacción para asegurar consistencia
        await this.rolPermisoRepository.manager.transaction(async transactionalEntityManager => {

            // 1. Desactivar todas las asignaciones actuales del rol
            await transactionalEntityManager.update(
                RolPermisoOrmEntity,
                { idRol, activo: true },
                {
                    activo: false,
                    fechaModificacion: new Date(),
                    idUsuarioModificacion: idUsuarioEjecutor
                }
            );

            // 2. Crear nuevas asignaciones para los permisos deseados
            if (idsPermisosDeseados.length > 0) {
                const nuevasAsignaciones = idsPermisosDeseados.map(idPermiso => ({
                    idRol,
                    idPermiso,
                    fechaCreacion: new Date(),
                    idUsuarioCreacion: idUsuarioEjecutor,
                    activo: true
                }));

                await transactionalEntityManager.save(RolPermisoOrmEntity, nuevasAsignaciones);
            }
        });
    }

    async existeAsignacion(idRol: number, idPermiso: number): Promise<boolean> {
        const count = await this.rolPermisoRepository.count({
            where: { idRol, idPermiso, activo: true }
        });
        return count > 0;
    }

    async rolExisteYEstaActivo(idRol: number): Promise<boolean> {
        const count = await this.rolRepository.count({
            where: { id: idRol, activo: true }
        });
        return count > 0;
    }

    async permisoExisteYEstaActivo(idPermiso: number): Promise<boolean> {
        const count = await this.permisoRepository.count({
            where: { id: idPermiso, activo: true }
        });
        return count > 0;
    }

    async validarPermisosExistenYActivos(idsPermisos: number[]): Promise<{
        validos: number[];
        invalidos: number[];
    }> {
        if (idsPermisos.length === 0) {
            return { validos: [], invalidos: [] };
        }

        const permisosExistentes = await this.permisoRepository.find({
            where: { activo: true },
            select: ['id']
        });

        const idsPermisosExistentes = permisosExistentes.map(p => p.id);

        const validos = idsPermisos.filter(id => idsPermisosExistentes.includes(id));
        const invalidos = idsPermisos.filter(id => !idsPermisosExistentes.includes(id));

        return { validos, invalidos };
    }
}