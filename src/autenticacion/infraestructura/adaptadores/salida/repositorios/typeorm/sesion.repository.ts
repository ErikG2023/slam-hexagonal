import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { SesionRepositorio, SesionConDetalles, FiltrosSesiones } from '../../../../../dominio/puertos/repositorios/sesion-repositorio.interface';
import { Sesion, EstadoSesion } from '../../../../../dominio/entidades/sesion.entity';
import { SesionOrmEntity } from './entidades/sesion.orm-entity';
import { SesionMapper } from '../mappers/sesion.mapper';

@Injectable()
export class TypeOrmSesionRepository implements SesionRepositorio {
    constructor(
        @InjectRepository(SesionOrmEntity)
        private readonly sesionRepository: Repository<SesionOrmEntity>,
    ) { }

    async guardar(sesion: Sesion): Promise<Sesion> {
        try {
            const sesionOrm = SesionMapper.toOrm(sesion);
            const sesionGuardada = await this.sesionRepository.save(sesionOrm);
            return SesionMapper.toDomain(sesionGuardada);
        } catch (error) {
            throw new Error(`Error al guardar la sesión: ${error.message}`);
        }
    }

    async buscarPorId(id: string): Promise<Sesion | null> {
        const sesionOrm = await this.sesionRepository.findOne({
            where: { id: parseInt(id) }
        });

        return sesionOrm ? SesionMapper.toDomain(sesionOrm) : null;
    }

    async buscarPorTokenHash(tokenHash: string): Promise<Sesion | null> {
        const sesionOrm = await this.sesionRepository.findOne({
            where: { token: tokenHash } // Recordar que guardamos el hash en el campo token
        });

        return sesionOrm ? SesionMapper.toDomain(sesionOrm) : null;
    }

    async buscarTodas(filtros: FiltrosSesiones = {}): Promise<Sesion[]> {
        const whereConditions: any = {};

        if (filtros.idUsuario) {
            whereConditions.idUsuario = filtros.idUsuario;
        }

        if (filtros.estado) {
            // Mapear estado a condiciones de BD
            switch (filtros.estado) {
                case EstadoSesion.ACTIVA:
                    whereConditions.activa = true;
                    whereConditions.activo = true;
                    whereConditions.fechaExpiracion = MoreThan(new Date());
                    break;
                case EstadoSesion.EXPIRADA:
                    whereConditions.fechaExpiracion = LessThan(new Date());
                    break;
                case EstadoSesion.CERRADA:
                    whereConditions.activa = false;
                    break;
            }
        }

        if (filtros.ipAddress) {
            whereConditions.ipAddress = filtros.ipAddress;
        }

        if (filtros.fechaDesde) {
            whereConditions.fechaCreacion = MoreThan(filtros.fechaDesde);
        }

        const sesionesOrm = await this.sesionRepository.find({
            where: whereConditions,
            take: filtros.limite || 10,
            skip: filtros.offset || 0,
            order: {
                fechaCreacion: 'DESC',
            },
        });

        return SesionMapper.toDomainArray(sesionesOrm);
    }

    async eliminar(id: string): Promise<void> {
        const resultado = await this.sesionRepository.update(parseInt(id), {
            activo: false,
            fechaModificacion: new Date(),
        });

        if (resultado.affected === 0) {
            throw new Error(`No se pudo eliminar la sesión con ID ${id}`);
        }
    }

    async buscarConDetalles(id: string): Promise<SesionConDetalles | null> {
        const resultado = await this.sesionRepository
            .createQueryBuilder('sesion')
            .innerJoin('usuario', 'usuario', 'usuario.id = sesion.id_usuario')
            .innerJoin('persona', 'persona', 'persona.id = usuario.id_persona')
            .innerJoin('rol', 'rol', 'rol.id = usuario.id_rol')
            .select([
                'sesion.id as id',
                'sesion.id_usuario as "idUsuario"',
                'sesion.token as "tokenHash"',
                'sesion.ip_address as "ipAddress"',
                'sesion.user_agent as "userAgent"',
                'sesion.fecha_creacion as "fechaCreacion"',
                'sesion.fecha_expiracion as "fechaExpiracion"',
                'sesion.last_websocket_activity as "ultimaActividad"',
                'CASE WHEN sesion.activo = false THEN \'CERRADA\' ' +
                'WHEN sesion.activa = false THEN \'CERRADA\' ' +
                'WHEN sesion.fecha_expiracion < NOW() THEN \'EXPIRADA\' ' +
                'ELSE \'ACTIVA\' END as estado',
                'sesion.device_id as "deviceId"',
                'sesion.device_name as "deviceName"',
                'usuario.username as username',
                `CONCAT(persona.nombres, ' ', persona.apellido_paterno, ' ', persona.apellido_materno) as "nombreCompleto"`,
                'rol.nombre as "nombreRol"'
            ])
            .where('sesion.id = :id', { id: parseInt(id) })
            .getRawOne();

        return resultado || null;
    }

    async listarConDetalles(filtros: FiltrosSesiones = {}): Promise<SesionConDetalles[]> {
        let query = this.sesionRepository
            .createQueryBuilder('sesion')
            .innerJoin('usuario', 'usuario', 'usuario.id = sesion.id_usuario')
            .innerJoin('persona', 'persona', 'persona.id = usuario.id_persona')
            .innerJoin('rol', 'rol', 'rol.id = usuario.id_rol')
            .select([
                'sesion.id as id',
                'sesion.id_usuario as "idUsuario"',
                'sesion.token as "tokenHash"',
                'sesion.ip_address as "ipAddress"',
                'sesion.user_agent as "userAgent"',
                'sesion.fecha_creacion as "fechaCreacion"',
                'sesion.fecha_expiracion as "fechaExpiracion"',
                'sesion.last_websocket_activity as "ultimaActividad"',
                'CASE WHEN sesion.activo = false THEN \'CERRADA\' ' +
                'WHEN sesion.activa = false THEN \'CERRADA\' ' +
                'WHEN sesion.fecha_expiracion < NOW() THEN \'EXPIRADA\' ' +
                'ELSE \'ACTIVA\' END as estado',
                'sesion.device_id as "deviceId"',
                'sesion.device_name as "deviceName"',
                'usuario.username as username',
                `CONCAT(persona.nombres, ' ', persona.apellido_paterno, ' ', persona.apellido_materno) as "nombreCompleto"`,
                'rol.nombre as "nombreRol"'
            ]);

        if (filtros.idUsuario) {
            query = query.andWhere('sesion.id_usuario = :idUsuario', { idUsuario: filtros.idUsuario });
        }

        if (filtros.ipAddress) {
            query = query.andWhere('sesion.ip_address = :ipAddress', { ipAddress: filtros.ipAddress });
        }

        query = query
            .orderBy('sesion.fecha_creacion', 'DESC')
            .limit(filtros.limite || 10)
            .offset(filtros.offset || 0);

        return await query.getRawMany();
    }

    async buscarSesionesActivasDeUsuario(idUsuario: number): Promise<Sesion[]> {
        const sesionesOrm = await this.sesionRepository.find({
            where: {
                idUsuario,
                activa: true,
                activo: true,
                fechaExpiracion: MoreThan(new Date())
            },
            order: {
                fechaCreacion: 'DESC'
            }
        });

        return SesionMapper.toDomainArray(sesionesOrm);
    }

    async contarSesionesActivasDeUsuario(idUsuario: number): Promise<number> {
        return await this.sesionRepository.count({
            where: {
                idUsuario,
                activa: true,
                activo: true,
                fechaExpiracion: MoreThan(new Date())
            }
        });
    }

    async cerrarSesionesDeUsuario(idUsuario: number, excepto?: string): Promise<void> {
        const whereConditions: any = {
            idUsuario,
            activa: true
        };

        if (excepto) {
            whereConditions.id = { $ne: parseInt(excepto) };
        }

        await this.sesionRepository.update(whereConditions, {
            activa: false,
            fechaModificacion: new Date()
        });
    }

    async cerrarSesionMasAntigua(idUsuario: number): Promise<void> {
        const sesionMasAntigua = await this.sesionRepository.findOne({
            where: {
                idUsuario,
                activa: true,
                activo: true
            },
            order: {
                fechaCreacion: 'ASC'
            }
        });

        if (sesionMasAntigua) {
            await this.sesionRepository.update(sesionMasAntigua.id, {
                activa: false,
                fechaModificacion: new Date()
            });
        }
    }

    async marcarSesionesExpiradas(): Promise<number> {
        const resultado = await this.sesionRepository.update(
            {
                fechaExpiracion: LessThan(new Date()),
                activa: true
            },
            {
                activa: false,
                fechaModificacion: new Date()
            }
        );

        return resultado.affected || 0;
    }

    async eliminarSesionesExpiradas(diasAntiguedad: number): Promise<number> {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

        const resultado = await this.sesionRepository.delete({
            fechaExpiracion: LessThan(fechaLimite),
            activa: false
        });

        return resultado.affected || 0;
    }

    async existeSesionActiva(id: string): Promise<boolean> {
        const count = await this.sesionRepository.count({
            where: {
                id: parseInt(id),
                activa: true,
                activo: true,
                fechaExpiracion: MoreThan(new Date())
            }
        });

        return count > 0;
    }

    async usuarioTieneSesionesActivas(idUsuario: number): Promise<boolean> {
        const count = await this.sesionRepository.count({
            where: {
                idUsuario,
                activa: true,
                activo: true,
                fechaExpiracion: MoreThan(new Date())
            }
        });

        return count > 0;
    }

    async contarRegistros(filtros: { estado?: EstadoSesion; idUsuario?: number } = {}): Promise<number> {
        const whereConditions: any = {};

        if (filtros.idUsuario) {
            whereConditions.idUsuario = filtros.idUsuario;
        }

        if (filtros.estado) {
            switch (filtros.estado) {
                case EstadoSesion.ACTIVA:
                    whereConditions.activa = true;
                    whereConditions.activo = true;
                    whereConditions.fechaExpiracion = MoreThan(new Date());
                    break;
                case EstadoSesion.EXPIRADA:
                    whereConditions.fechaExpiracion = LessThan(new Date());
                    break;
                case EstadoSesion.CERRADA:
                    whereConditions.activa = false;
                    break;
            }
        }

        return await this.sesionRepository.count({
            where: whereConditions
        });
    }
}