import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ValidarSesionCasoUso } from '../../aplicacion/casos-uso/validar-sesion.caso-uso';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly validarSesionCasoUso: ValidarSesionCasoUso,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Verificar si la ruta es pública
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true; // Permitir acceso sin autenticación
        }

        // 2. Obtener request y extraer token
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Token de autorización requerido');
        }

        try {
            // 3. Validar sesión usando nuestro caso de uso
            const resultado = await this.validarSesionCasoUso.ejecutar(authHeader);

            if (!resultado.valid) {
                throw new UnauthorizedException(`Sesión inválida: ${resultado.reason}`);
            }

            // 4. Inyectar datos del usuario en el request
            request.user = resultado.usuario;
            request.session = resultado.session;

            return true;

        } catch (error) {
            throw new UnauthorizedException('Token inválido o sesión expirada');
        }
    }
}