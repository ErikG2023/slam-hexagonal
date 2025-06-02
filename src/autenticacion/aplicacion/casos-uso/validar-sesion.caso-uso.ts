import { Logger } from '@nestjs/common';
import { AutenticacionDominioService } from '../../dominio/servicios/autenticacion-dominio.service';
import { JwtService } from '../../infraestructura/servicios/jwt.service';
import { BlacklistTokenService } from '../../infraestructura/servicios/blacklist-token.service';
import { ValidarSesionResponseDto } from '../dtos/validar-sesion-response.dto';
import { TokenInvalidoException } from '../../dominio/excepciones/autenticacion-domain.exception';
import * as crypto from 'crypto';

export class ValidarSesionCasoUso {
    private readonly logger = new Logger(ValidarSesionCasoUso.name);

    constructor(
        private readonly autenticacionDominioService: AutenticacionDominioService,
        private readonly jwtService: JwtService,
        private readonly blacklistTokenService: BlacklistTokenService
    ) { }

    async ejecutar(authorizationHeader: string): Promise<ValidarSesionResponseDto> {
        try {
            // 1. Extraer token del header
            const token = this.jwtService.extraerTokenDeHeader(authorizationHeader);

            // 2. Validar estructura del JWT
            const payload = this.jwtService.validarToken(token);

            // 3. Generar hash del token para verificar blacklist
            const tokenHash = this.generarHashToken(token);

            // 4. Verificar si el token está en blacklist
            if (this.blacklistTokenService.estaEnBlacklist(tokenHash)) {
                this.logger.warn(`Token en blacklist detectado`, {
                    userId: payload.userId,
                    sessionId: payload.sessionId
                });

                return new ValidarSesionResponseDto({
                    valida: false,
                    razon: 'TOKEN_INVALIDADO'
                });
            }

            // 5. Validar sesión en el dominio
            const resultado = await this.autenticacionDominioService.validarSesion(
                payload.sessionId,
                tokenHash
            );

            if (!resultado.valida) {
                this.logger.debug(`Sesión no válida: ${resultado.razon}`, {
                    sessionId: payload.sessionId,
                    userId: payload.userId
                });
            } else {
                this.logger.debug(`Sesión validada exitosamente`, {
                    userId: resultado.usuario?.id,
                    sessionId: payload.sessionId
                });
            }

            return new ValidarSesionResponseDto(resultado);

        } catch (error) {
            this.logger.warn(`Error validando sesión: ${error.message}`, {
                tipoError: error.constructor.name
            });

            return new ValidarSesionResponseDto({
                valida: false,
                razon: error.constructor.name === 'TokenExpiradoException' ? 'TOKEN_EXPIRADO' :
                    error.constructor.name === 'TokenInvalidoException' ? 'TOKEN_INVALIDO' :
                        'ERROR_VALIDACION'
            });
        }
    }

    private generarHashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}