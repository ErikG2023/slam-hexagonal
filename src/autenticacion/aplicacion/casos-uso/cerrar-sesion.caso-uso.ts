import { Logger } from '@nestjs/common';
import { AutenticacionDominioService } from '../../dominio/servicios/autenticacion-dominio.service';
import { JwtService } from '../../infraestructura/servicios/jwt.service';
import { BlacklistTokenService } from '../../infraestructura/servicios/blacklist-token.service';
import * as crypto from 'crypto';

export interface CerrarSesionResponse {
    success: boolean;
    mensaje: string;
    fechaCierre: string;
}

export class CerrarSesionCasoUso {
    private readonly logger = new Logger(CerrarSesionCasoUso.name);

    constructor(
        private readonly autenticacionDominioService: AutenticacionDominioService,
        private readonly jwtService: JwtService,
        private readonly blacklistTokenService: BlacklistTokenService
    ) { }

    async ejecutar(authorizationHeader: string): Promise<CerrarSesionResponse> {
        try {
            // 1. Extraer y validar token
            const token = this.jwtService.extraerTokenDeHeader(authorizationHeader);
            const payload = this.jwtService.validarToken(token);

            // 2. Obtener fecha de expiración del token
            const fechaExpiracion = this.jwtService.obtenerTiempoExpiracion(token);

            // 3. Generar hash del token
            const tokenHash = this.generarHashToken(token);

            // 4. Cerrar sesión en el dominio
            await this.autenticacionDominioService.cerrarSesion(payload.sessionId);

            // 5. Agregar token a blacklist
            this.blacklistTokenService.agregarToken(
                tokenHash,
                fechaExpiracion,
                'Logout manual'
            );

            const fechaCierre = new Date();

            this.logger.log(`Sesión cerrada exitosamente`, {
                userId: payload.userId,
                sessionId: payload.sessionId,
                username: payload.username,
                fechaCierre: fechaCierre.toISOString()
            });

            return {
                success: true,
                mensaje: 'Sesión cerrada exitosamente',
                fechaCierre: fechaCierre.toISOString()
            };

        } catch (error) {
            this.logger.error(`Error cerrando sesión: ${error.message}`, {
                tipoError: error.constructor.name
            });
            throw error;
        }
    }

    private generarHashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}