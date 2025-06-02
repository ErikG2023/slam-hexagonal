import { Sesion, EstadoSesion } from '../../../../../dominio/entidades/sesion.entity';
import { SesionOrmEntity } from '../typeorm/entidades/sesion.orm-entity';

export class SesionMapper {
    /**
     * Convierte una entidad ORM de TypeORM a una entidad de dominio pura.
     */
    static toDomain(ormEntity: SesionOrmEntity): Sesion {
        // Derivar estado del boolean activa
        let estado: EstadoSesion;
        if (!ormEntity.activo) {
            estado = EstadoSesion.CERRADA;
        } else if (!ormEntity.activa) {
            estado = EstadoSesion.CERRADA;
        } else if (new Date() > ormEntity.fechaExpiracion) {
            estado = EstadoSesion.EXPIRADA;
        } else {
            estado = EstadoSesion.ACTIVA;
        }

        return new Sesion({
            id: ormEntity.id.toString(), // Convertimos number a string para compatibilidad
            idUsuario: ormEntity.idUsuario,
            tokenHash: ormEntity.token, // El campo token contiene el hash
            ipAddress: ormEntity.ipAddress || '',
            userAgent: ormEntity.userAgent || '',
            fechaCreacion: ormEntity.fechaCreacion,
            fechaExpiracion: ormEntity.fechaExpiracion,
            ultimaActividad: ormEntity.lastWebsocketActivity || ormEntity.fechaCreacion,
            estado: estado,
            deviceId: ormEntity.deviceId,
            deviceName: ormEntity.deviceName,
        });
    }

    /**
     * Convierte una entidad de dominio a una entidad ORM de TypeORM.
     */
    static toOrm(domainEntity: Sesion): SesionOrmEntity {
        const ormEntity = new SesionOrmEntity();

        // Solo asignamos el ID si la entidad ya fue persistida
        try {
            ormEntity.id = parseInt(domainEntity.id); // Convertimos string a number
        } catch (error) {
            // Si la entidad no tiene ID, TypeORM generará uno nuevo
        }

        ormEntity.idUsuario = domainEntity.idUsuario;
        ormEntity.token = domainEntity.tokenHash; // Guardamos hash en campo token
        ormEntity.ipAddress = domainEntity.ipAddress;
        ormEntity.userAgent = domainEntity.userAgent;
        ormEntity.fechaCreacion = domainEntity.fechaCreacion;
        ormEntity.fechaInicio = domainEntity.fechaCreacion;
        ormEntity.fechaExpiracion = domainEntity.fechaExpiracion;
        ormEntity.lastWebsocketActivity = domainEntity.ultimaActividad;
        ormEntity.deviceId = domainEntity.deviceId;
        ormEntity.deviceName = domainEntity.deviceName;

        // Mapear estado a boolean
        ormEntity.activa = domainEntity.estado === EstadoSesion.ACTIVA;
        ormEntity.activo = domainEntity.estado !== EstadoSesion.CERRADA;

        return ormEntity;
    }

    /**
     * Convierte un array de entidades ORM a un array de entidades de dominio.
     */
    static toDomainArray(ormEntities: SesionOrmEntity[]): Sesion[] {
        return ormEntities.map(ormEntity => this.toDomain(ormEntity));
    }
}