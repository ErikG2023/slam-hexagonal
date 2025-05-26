import { Usuario } from '../../../../../dominio/entidades/usuario.entity';
import { UsuarioOrmEntity } from '../typeorm/entidades/usuario.orm-entity';

export class UsuarioMapper {
    /**
     * Convierte una entidad ORM de TypeORM a una entidad de dominio pura.
     */
    static toDomain(ormEntity: UsuarioOrmEntity): Usuario {
        return new Usuario({
            id: ormEntity.id,
            idPersona: ormEntity.idPersona,
            idRol: ormEntity.idRol,
            username: ormEntity.username,
            password: ormEntity.password,
            bloqueado: ormEntity.bloqueado,
            ultimoAcceso: ormEntity.ultimoAcceso,
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
    static toOrm(domainEntity: Usuario): UsuarioOrmEntity {
        const ormEntity = new UsuarioOrmEntity();

        // Solo asignamos el ID si la entidad ya fue persistida
        try {
            ormEntity.id = domainEntity.id;
        } catch (error) {
            // Si la entidad no tiene ID, TypeORM hará un INSERT
        }

        ormEntity.idPersona = domainEntity.idPersona;
        ormEntity.idRol = domainEntity.idRol;
        ormEntity.username = domainEntity.username;
        ormEntity.password = domainEntity.password;
        ormEntity.bloqueado = domainEntity.bloqueado;
        ormEntity.ultimoAcceso = domainEntity.ultimoAcceso;
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
    static toDomainArray(ormEntities: UsuarioOrmEntity[]): Usuario[] {
        return ormEntities.map(ormEntity => this.toDomain(ormEntity));
    }
}