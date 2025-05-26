import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, MoreThan } from 'typeorm';
import { UsuarioRepositorio, UsuarioConDetalles } from '../../../../../dominio/puertos/repositorios/usuario-repositorio.interface';
import { Usuario } from '../../../../../dominio/entidades/usuario.entity';
import { UsuarioOrmEntity } from './entidades/usuario.orm-entity';
import { PersonaOrmEntity } from './entidades/persona.orm-entity';
import { RolOrmEntity } from '../../../../../../rol/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';
import { UsuarioMapper } from '../mappers/usuario.mapper';

@Injectable()
export class TypeOrmUsuarioRepository implements UsuarioRepositorio {
    constructor(
        @InjectRepository(UsuarioOrmEntity)
        private readonly usuarioRepository: Repository<UsuarioOrmEntity>,
        @InjectRepository(PersonaOrmEntity)
        private readonly personaRepository: Repository<PersonaOrmEntity>,
        @InjectRepository(RolOrmEntity)
        private readonly rolRepository: Repository<RolOrmEntity>,
    ) { }

    async guardar(usuario: Usuario): Promise<Usuario> {
        try {
            const usuarioOrm = UsuarioMapper.toOrm(usuario);
            const usuarioGuardado = await this.usuarioRepository.save(usuarioOrm);
            return UsuarioMapper.toDomain(usuarioGuardado);
        } catch (error) {
            if (error.code === '23505') {
                if (error.constraint?.includes('username')) {
                    throw new Error(`Ya existe un usuario con el nombre de usuario especificado`);
                }
                throw new Error(`Ya existe un usuario con los datos especificados`);
            }
            throw new Error(`Error al guardar el usuario: ${error.message}`);
        }
    }

    async buscarPorId(id: number): Promise<Usuario | null> {
        const usuarioOrm = await this.usuarioRepository.findOne({
            where: { id }
        });

        return usuarioOrm ? UsuarioMapper.toDomain(usuarioOrm) : null;
    }

    async buscarPorUsername(username: string): Promise<Usuario | null> {
        const usuarioOrm = await this.usuarioRepository.findOne({
            where: { username: username.toLowerCase() }
        });

        return usuarioOrm ? UsuarioMapper.toDomain(usuarioOrm) : null;
    }

    async buscarTodos(filtros: {
        activo?: boolean;
        bloqueado?: boolean;
        idRol?: number;
        username?: string;
        limite?: number;
        offset?: number;
    } = {}): Promise<Usuario[]> {
        const whereConditions: any = {};

        if (filtros.activo !== undefined) {
            whereConditions.activo = filtros.activo;
        }

        if (filtros.bloqueado !== undefined) {
            whereConditions.bloqueado = filtros.bloqueado;
        }

        if (filtros.idRol) {
            whereConditions.idRol = filtros.idRol;
        }

        if (filtros.username) {
            whereConditions.username = Like(`%${filtros.username.toLowerCase()}%`);
        }

        const usuariosOrm = await this.usuarioRepository.find({
            where: whereConditions,
            take: filtros.limite || 10,
            skip: filtros.offset || 0,
            order: {
                username: 'ASC',
            },
        });

        return UsuarioMapper.toDomainArray(usuariosOrm);
    }

    async eliminar(id: number, idUsuarioEjecutor: number): Promise<void> {
        const resultado = await this.usuarioRepository.update(id, {
            activo: false,
            fechaModificacion: new Date(),
            idUsuarioModificacion: idUsuarioEjecutor,
        });

        if (resultado.affected === 0) {
            throw new Error(`No se pudo eliminar el usuario con ID ${id}. Puede que no exista.`);
        }
    }

    async restaurar(id: number, idUsuarioEjecutor: number): Promise<void> {
        const resultado = await this.usuarioRepository.update(id, {
            activo: true,
            fechaModificacion: new Date(),
            idUsuarioModificacion: idUsuarioEjecutor,
        });

        if (resultado.affected === 0) {
            throw new Error(`No se pudo restaurar el usuario con ID ${id}. Puede que no exista.`);
        }
    }

    async buscarConDetalles(id: number): Promise<UsuarioConDetalles | null> {
        const resultado = await this.usuarioRepository
            .createQueryBuilder('usuario')
            .innerJoin('persona', 'persona', 'persona.id = usuario.id_persona')
            .innerJoin('rol', 'rol', 'rol.id = usuario.id_rol')
            .select([
                'usuario.id as id',
                'usuario.id_persona as "idPersona"',
                'usuario.id_rol as "idRol"',
                'usuario.username as username',
                'usuario.bloqueado as bloqueado',
                'usuario.ultimo_acceso as "ultimoAcceso"',
                'usuario.fecha_creacion as "fechaCreacion"',
                'usuario.activo as activo',
                `CONCAT(persona.nombres, ' ', persona.apellido_paterno, ' ', persona.apellido_materno) as "nombreCompleto"`,
                'persona.email as email',
                'persona.rut as rut',
                'rol.nombre as "nombreRol"',
                'rol.descripcion as "descripcionRol"'
            ])
            .where('usuario.id = :id', { id })
            .getRawOne();

        return resultado || null;
    }

    async listarConDetalles(filtros: {
        activo?: boolean;
        bloqueado?: boolean;
        idRol?: number;
        username?: string;
        limite?: number;
        offset?: number;
    } = {}): Promise<UsuarioConDetalles[]> {
        let query = this.usuarioRepository
            .createQueryBuilder('usuario')
            .innerJoin('persona', 'persona', 'persona.id = usuario.id_persona')
            .innerJoin('rol', 'rol', 'rol.id = usuario.id_rol')
            .select([
                'usuario.id as id',
                'usuario.id_persona as "idPersona"',
                'usuario.id_rol as "idRol"',
                'usuario.username as username',
                'usuario.bloqueado as bloqueado',
                'usuario.ultimo_acceso as "ultimoAcceso"',
                'usuario.fecha_creacion as "fechaCreacion"',
                'usuario.activo as activo',
                `CONCAT(persona.nombres, ' ', persona.apellido_paterno, ' ', persona.apellido_materno) as "nombreCompleto"`,
                'persona.email as email',
                'persona.rut as rut',
                'rol.nombre as "nombreRol"',
                'rol.descripcion as "descripcionRol"'
            ]);

        if (filtros.activo !== undefined) {
            query = query.andWhere('usuario.activo = :activo', { activo: filtros.activo });
        }

        if (filtros.bloqueado !== undefined) {
            query = query.andWhere('usuario.bloqueado = :bloqueado', { bloqueado: filtros.bloqueado });
        }

        if (filtros.idRol) {
            query = query.andWhere('usuario.id_rol = :idRol', { idRol: filtros.idRol });
        }

        if (filtros.username) {
            query = query.andWhere('usuario.username ILIKE :username', { username: `%${filtros.username}%` });
        }

        query = query
            .orderBy('usuario.username', 'ASC')
            .limit(filtros.limite || 10)
            .offset(filtros.offset || 0);

        return await query.getRawMany();
    }

    async existeConUsername(username: string, idExcluir?: number): Promise<boolean> {
        const whereConditions: any = {
            username: username.toLowerCase(),
            activo: true,
        };

        if (idExcluir) {
            whereConditions.id = Not(idExcluir);
        }

        const count = await this.usuarioRepository.count({
            where: whereConditions
        });

        return count > 0;
    }

    async existeYEstaActivo(id: number): Promise<boolean> {
        const count = await this.usuarioRepository.count({
            where: {
                id,
                activo: true
            }
        });

        return count > 0;
    }

    async personaYaTieneUsuario(idPersona: number, idExcluir?: number): Promise<boolean> {
        const whereConditions: any = {
            idPersona,
            activo: true,
        };

        if (idExcluir) {
            whereConditions.id = Not(idExcluir);
        }

        const count = await this.usuarioRepository.count({
            where: whereConditions
        });

        return count > 0;
    }

    async personaExisteYEstaActiva(idPersona: number): Promise<boolean> {
        const count = await this.personaRepository.count({
            where: {
                id: idPersona,
                activo: true
            }
        });

        return count > 0;
    }

    async rolExisteYEstaActivo(idRol: number): Promise<boolean> {
        const count = await this.rolRepository.count({
            where: {
                id: idRol,
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

        // Validación 1: Sesiones activas no expiradas
        // Esta validación es crítica porque un usuario con sesiones activas
        // que se "elimina" podría crear inconsistencias en tiempo real
        const sesionesActivas = await this.usuarioRepository.manager.count('sesion', {
            where: {
                idUsuario: id,
                activa: true,
                fechaExpiracion: MoreThan(new Date()) // Solo sesiones no expiradas
            }
        });

        if (sesionesActivas > 0) {
            dependencias.push(`${sesionesActivas} sesión(es) activa(s) que se invalidarían abruptamente`);
        }

        // Validación 2: Protección del último administrador
        // Esta es una validación de seguridad del sistema absolutamente crítica
        const esUltimoAdministrador = await this.esUltimoAdministradorActivo(id);
        if (esUltimoAdministrador) {
            dependencias.push(`Es el único administrador activo - eliminar bloquearía la administración del sistema`);
        }

        if (dependencias.length > 0) {
            return {
                puedeEliminarse: false,
                razon: `No se puede desactivar el usuario por razones de seguridad y continuidad operacional`,
                dependencias
            };
        }

        return { puedeEliminarse: true };
    }

    // Método auxiliar para detectar si es el último administrador activo
    private async esUltimoAdministradorActivo(idUsuario: number): Promise<boolean> {
        // Primero verificamos si este usuario es administrador
        const esAdministrador = await this.usuarioRepository
            .createQueryBuilder('usuario')
            .innerJoin('rol', 'rol', 'rol.id = usuario.id_rol')
            .where('usuario.id = :idUsuario', { idUsuario })
            .andWhere('usuario.activo = true')
            .andWhere('rol.activo = true')
            .andWhere('LOWER(rol.nombre) LIKE :patron', { patron: '%administrador%' })
            .getOne();

        // Si no es administrador, no hay problema
        if (!esAdministrador) {
            return false;
        }

        // Si es administrador, contamos cuántos administradores activos hay en total
        const totalAdministradoresActivos = await this.usuarioRepository
            .createQueryBuilder('usuario')
            .innerJoin('rol', 'rol', 'rol.id = usuario.id_rol')
            .where('usuario.activo = true')
            .andWhere('usuario.bloqueado = false')  // Administradores no bloqueados
            .andWhere('rol.activo = true')
            .andWhere('LOWER(rol.nombre) LIKE :patron', { patron: '%administrador%' })
            .getCount();

        // Es el último si solo hay uno y ese uno es él
        return totalAdministradoresActivos <= 1;
    }

    async contarRegistros(filtros: { activo?: boolean; bloqueado?: boolean } = {}): Promise<number> {
        const whereConditions: any = {};

        if (filtros.activo !== undefined) {
            whereConditions.activo = filtros.activo;
        }

        if (filtros.bloqueado !== undefined) {
            whereConditions.bloqueado = filtros.bloqueado;
        }

        return await this.usuarioRepository.count({
            where: whereConditions
        });
    }

    async actualizarUltimoAcceso(id: number): Promise<void> {
        await this.usuarioRepository.update(id, {
            ultimoAcceso: new Date()
        });
    }
}