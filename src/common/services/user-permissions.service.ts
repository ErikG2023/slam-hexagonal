import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioOrmEntity } from '../../usuario/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/usuario.orm-entity';

@Injectable()
export class UserPermissionsService {
    private readonly logger = new Logger(UserPermissionsService.name);

    constructor(
        @InjectRepository(UsuarioOrmEntity)
        private readonly usuarioRepository: Repository<UsuarioOrmEntity>,
    ) { }

    /**
     * Obtiene todos los permisos de un usuario basándose en su rol
     */
    async getUserPermissions(userId: number): Promise<string[]> {
        try {
            // Consulta para obtener permisos del usuario a través de su rol
            const permisos = await this.usuarioRepository
                .createQueryBuilder('usuario')
                .innerJoin('rol', 'rol', 'rol.id = usuario.id_rol')
                .innerJoin('rol_permiso', 'rp', 'rp.id_rol = rol.id')
                .innerJoin('permiso', 'permiso', 'permiso.id = rp.id_permiso')
                .select('permiso.codigo', 'codigo')
                .where('usuario.id = :userId', { userId })
                .andWhere('usuario.activo = true')
                .andWhere('usuario.bloqueado = false')
                .andWhere('rol.activo = true')
                .andWhere('rp.activo = true')
                .andWhere('permiso.activo = true')
                .getRawMany();

            const codigosPermisos = permisos.map(p => p.codigo);

            this.logger.debug(`Usuario ${userId} tiene permisos: [${codigosPermisos.join(', ')}]`);

            return codigosPermisos;

        } catch (error) {
            this.logger.error(`Error obteniendo permisos para usuario ${userId}: ${error.message}`);
            return [];
        }
    }

    /**
     * Verifica si un usuario tiene un permiso específico
     */
    async hasPermission(userId: number, permissionCode: string): Promise<boolean> {
        const userPermissions = await this.getUserPermissions(userId);
        return userPermissions.includes(permissionCode);
    }

    /**
     * Verifica si un usuario tiene todos los permisos especificados
     */
    async hasAllPermissions(userId: number, permissionCodes: string[]): Promise<boolean> {
        const userPermissions = await this.getUserPermissions(userId);
        return permissionCodes.every(permission => userPermissions.includes(permission));
    }
}