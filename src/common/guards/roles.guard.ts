import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Obtener roles requeridos del decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Si no hay roles especificados, permitir acceso
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // 3. Obtener usuario del request (puesto por JwtAuthGuard)
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            this.logger.warn('Usuario no encontrado en request. ¿JwtAuthGuard ejecutado?');
            throw new ForbiddenException('Usuario no autenticado');
        }

        // 4. Verificar si el usuario tiene alguno de los roles requeridos
        const userRole = user.rol; // Campo del usuario que viene del JWT
        const hasRequiredRole = requiredRoles.includes(userRole);

        if (!hasRequiredRole) {
            this.logger.warn(`Acceso denegado. Usuario ${user.username} (rol: ${userRole}) intentó acceder a endpoint que requiere roles: [${requiredRoles.join(', ')}]`);

            throw new ForbiddenException(
                `Acceso denegado. Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`
            );
        }

        this.logger.debug(`Acceso autorizado. Usuario ${user.username} con rol ${userRole} accede a endpoint`);
        return true;
    }
}