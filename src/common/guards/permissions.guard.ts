import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserPermissionsService } from '../services/user-permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    private readonly logger = new Logger(PermissionsGuard.name);

    constructor(
        private reflector: Reflector,
        private readonly userPermissionsService: UserPermissionsService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Obtener permisos requeridos del decorator
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Si no hay permisos especificados, permitir acceso
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        // 3. Obtener usuario del request
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            this.logger.warn('Usuario no encontrado en request para verificación de permisos');
            throw new ForbiddenException('Usuario no autenticado');
        }

        // 4. Obtener permisos del usuario desde la base de datos
        const userPermissions = await this.userPermissionsService.getUserPermissions(user.id);

        // 5. Verificar si el usuario tiene TODOS los permisos requeridos
        const hasAllPermissions = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!hasAllPermissions) {
            const missingPermissions = requiredPermissions.filter(permission =>
                !userPermissions.includes(permission)
            );

            this.logger.warn(`Acceso denegado. Usuario ${user.username} no tiene permisos: [${missingPermissions.join(', ')}]`);

            throw new ForbiddenException(
                `Acceso denegado. Se requieren los siguientes permisos: ${missingPermissions.join(', ')}`
            );
        }

        this.logger.debug(`Acceso autorizado. Usuario ${user.username} tiene todos los permisos requeridos`);
        return true;
    }
}