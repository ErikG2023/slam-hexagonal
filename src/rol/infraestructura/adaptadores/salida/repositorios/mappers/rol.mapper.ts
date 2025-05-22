import { Rol } from '../../../../../dominio/entidades/rol.entity';
import { RolOrmEntity } from '../typeorm/entidades/rol.orm-entity';

export class RolMapper {
    /**
     * Convierte una entidad ORM de TypeORM a una entidad de dominio pura.
     * Este proceso es como traducir de "lenguaje de base de datos" a "lenguaje de negocio".
     */
    static toDomain(ormEntity: RolOrmEntity): Rol {
        return new Rol({
            id: ormEntity.id,
            nombre: ormEntity.nombre,
            descripcion: ormEntity.descripcion,
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
    static toOrm(domainEntity: Rol): RolOrmEntity {
        const ormEntity = new RolOrmEntity();

        // Solo asignamos el ID si la entidad ya fue persistida
        // Esto permite que TypeORM determine si debe hacer INSERT o UPDATE
        try {
            ormEntity.id = domainEntity.id;
        } catch (error) {
            // Si la entidad no tiene ID, TypeORM hará un INSERT
            // Si tiene ID, TypeORM hará un UPDATE
        }

        ormEntity.nombre = domainEntity.nombre;
        ormEntity.descripcion = domainEntity.descripcion;
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
    static toDomainArray(ormEntities: RolOrmEntity[]): Rol[] {
        return ormEntities.map(ormEntity => this.toDomain(ormEntity));
    }
}