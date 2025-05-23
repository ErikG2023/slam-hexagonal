import { Permiso } from '../../../../../dominio/entidades/permiso.entity';
import { PermisoOrmEntity } from '../typeorm/entidades/permiso.orm-entity';

export class PermisoMapper {
    /**
     * Convierte una entidad ORM de TypeORM a una entidad de dominio pura.
     * Este proceso es como traducir de "lenguaje de base de datos" a "lenguaje de negocio".
     */
    static toDomain(ormEntity: PermisoOrmEntity): Permiso {
        return new Permiso({
            id: ormEntity.id,
            nombre: ormEntity.nombre,
            descripcion: ormEntity.descripcion,
            codigo: ormEntity.codigo,
            fechaCreacion: ormEntity.fechaCreacion,
            idUsuarioCreacion: ormEntity.idUsuarioCreacion,
            fechaModificacion: ormEntity.fechaModificacion,
            idUsuarioModificacion: ormEntity.idUsuarioModificacion,
            activo: ormEntity.activo,
        });
    }

    /**
     * Convierte una entidad de dominio a una entidad ORM de TypeORM.
     * Este proceso prepara nuestros datos de negocio para ser persistidos.
     */
    static toOrm(domainEntity: Permiso): PermisoOrmEntity {
        const ormEntity = new PermisoOrmEntity();

        // Solo asignamos el ID si la entidad ya fue persistida
        try {
            ormEntity.id = domainEntity.id;
        } catch (error) {
            // Si la entidad no tiene ID, TypeORM hará un INSERT
        }

        ormEntity.nombre = domainEntity.nombre;
        ormEntity.descripcion = domainEntity.descripcion;
        ormEntity.codigo = domainEntity.codigo;
        ormEntity.fechaCreacion = domainEntity.fechaCreacion;
        ormEntity.idUsuarioCreacion = domainEntity.idUsuarioCreacion;
        ormEntity.fechaModificacion = domainEntity.fechaModificacion;
        ormEntity.idUsuarioModificacion = domainEntity.idUsuarioModificacion;
        ormEntity.activo = domainEntity.activo;

        return ormEntity;
    }

    /**
     * Convierte un array de entidades ORM a un array de entidades de dominio.
     * Útil para operaciones de listado que devuelven múltiples registros.
     */
    static toDomainArray(ormEntities: PermisoOrmEntity[]): Permiso[] {
        return ormEntities.map(ormEntity => this.toDomain(ormEntity));
    }
}