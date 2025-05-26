import { RolPermiso } from '../../../../../dominio/entidades/rol-permiso.entity';
import { RolPermisoOrmEntity } from '../typeorm/entidades/rol-permiso.orm-entity';

export class RolPermisoMapper {
    /**
     * Convierte una entidad ORM de TypeORM a una entidad de dominio pura.
     */
    static toDomain(ormEntity: RolPermisoOrmEntity): RolPermiso {
        return new RolPermiso({
            id: ormEntity.id,
            idRol: ormEntity.idRol,
            idPermiso: ormEntity.idPermiso,
            fechaCreacion: ormEntity.fechaCreacion,
            idUsuarioCreacion: ormEntity.idUsuarioCreacion,
            fechaModificacion: ormEntity.fechaModificacion,
            idUsuarioModificacion: ormEntity.idUsuarioModificacion,
            activo: ormEntity.activo,
        });
    }

    /**
     * Convierte una entidad de dominio a una entidad ORM de TypeORM.
     */
    static toOrm(domainEntity: RolPermiso): RolPermisoOrmEntity {
        const ormEntity = new RolPermisoOrmEntity();

        // Solo asignamos el ID si la entidad ya fue persistida
        try {
            ormEntity.id = domainEntity.id;
        } catch (error) {
            // Si la entidad no tiene ID, TypeORM hará un INSERT
        }

        ormEntity.idRol = domainEntity.idRol;
        ormEntity.idPermiso = domainEntity.idPermiso;
        ormEntity.fechaCreacion = domainEntity.fechaCreacion;
        ormEntity.idUsuarioCreacion = domainEntity.idUsuarioCreacion;
        ormEntity.fechaModificacion = domainEntity.fechaModificacion;
        ormEntity.idUsuarioModificacion = domainEntity.idUsuarioModificacion;
        ormEntity.activo = domainEntity.activo;

        return ormEntity;
    }

    /**
     * Convierte un array de entidades ORM a un array de entidades de dominio.
     */
    static toDomainArray(ormEntities: RolPermisoOrmEntity[]): RolPermiso[] {
        return ormEntities.map(ormEntity => this.toDomain(ormEntity));
    }
}