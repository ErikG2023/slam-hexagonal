import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfiguracionAutenticacion } from '../../dominio/value-objects/configuracion-autenticacion.vo';
import { TokenInvalidoException, TokenExpiradoException } from '../../dominio/excepciones/autenticacion-domain.exception';

export interface JwtPayload {
    userId: number;
    sessionId: string;
    username: string;
    iat?: number;
    exp?: number;
}

export interface TokenInfo {
    token: string;
    payload: JwtPayload;
    expiresAt: Date;
}

@Injectable()
export class JwtService {
    private readonly logger = new Logger(JwtService.name);

    constructor(
        private readonly configuracion: ConfiguracionAutenticacion
    ) { }

    generarToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenInfo {
        try {
            const ahora = Math.floor(Date.now() / 1000);
            const expiracion = ahora + (this.configuracion.sessionDurationMinutes * 60);

            const tokenPayload: JwtPayload = {
                ...payload,
                iat: ahora,
                exp: expiracion
            };

            const token = jwt.sign(tokenPayload, this.configuracion.jwtSecret, {
                algorithm: 'HS256'
            });

            this.logger.debug(`Token generado para usuario ${payload.userId}, sesión ${payload.sessionId}`);

            return {
                token,
                payload: tokenPayload,
                expiresAt: new Date(expiracion * 1000)
            };

        } catch (error) {
            this.logger.error(`Error al generar token: ${error.message}`, {
                userId: payload.userId,
                sessionId: payload.sessionId
            });
            throw new Error('Error interno al generar token');
        }
    }

    validarToken(token: string): JwtPayload {
        try {
            const payload = jwt.verify(token, this.configuracion.jwtSecret) as JwtPayload;

            this.logger.debug(`Token validado para usuario ${payload.userId}, sesión ${payload.sessionId}`);

            return payload;

        } catch (error) {
            this.logger.warn(`Token inválido: ${error.message}`);

            if (error.name === 'TokenExpiredError') {
                throw new TokenExpiradoException();
            }

            if (error.name === 'JsonWebTokenError') {
                throw new TokenInvalidoException(error.message);
            }

            if (error.name === 'NotBeforeError') {
                throw new TokenInvalidoException('Token usado antes de tiempo');
            }

            throw new TokenInvalidoException('Token malformado');
        }
    }

    extraerTokenDeHeader(authorizationHeader: string | undefined): string {
        if (!authorizationHeader) {
            throw new TokenInvalidoException('Header Authorization no proporcionado');
        }

        const partes = authorizationHeader.split(' ');

        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            throw new TokenInvalidoException('Formato de Authorization inválido. Debe ser "Bearer {token}"');
        }

        const token = partes[1];

        if (!token || token.trim().length === 0) {
            throw new TokenInvalidoException('Token vacío');
        }

        return token.trim();
    }

    obtenerTiempoExpiracion(token: string): Date {
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            if (!decoded || !decoded.exp) {
                throw new TokenInvalidoException('Token sin fecha de expiración');
            }
            return new Date(decoded.exp * 1000);
        } catch (error) {
            throw new TokenInvalidoException('No se puede obtener fecha de expiración');
        }
    }
}