import { Logger } from '@nestjs/common';
import { AutenticacionDominioService } from '../../dominio/servicios/autenticacion-dominio.service';
import { JwtService } from '../../infraestructura/servicios/jwt.service';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import * as crypto from 'crypto';

export class IniciarSesionCasoUso {
    private readonly logger = new Logger(IniciarSesionCasoUso.name);

    constructor(
        private readonly autenticacionDominioService: AutenticacionDominioService,
        private readonly jwtService: JwtService
    ) { }

    async ejecutar(
        datos: LoginRequestDto,
        ipAddress: string,
        userAgent: string
    ): Promise<LoginResponseDto> {
        try {
            this.logger.log(`Iniciando proceso de login para usuario: ${datos.username}`, {
                ip: ipAddress,
                deviceName: datos.deviceName
            });

            // 1. Iniciar sesión en el dominio
            const resultado = await this.autenticacionDominioService.iniciarSesion({
                username: datos.username,
                password: datos.password,
                ipAddress,
                userAgent,
                deviceId: datos.deviceId,
                deviceName: datos.deviceName
            });

            // 2. Generar JWT
            const tokenInfo = this.jwtService.generarToken({
                userId: resultado.usuario.id,
                sessionId: resultado.sesion.id,
                username: resultado.usuario.username
            });

            // 3. Actualizar la sesión con el hash real del JWT
            const tokenHash = this.generarHashToken(tokenInfo.token);
            await this.autenticacionDominioService.actualizarHashSesion(resultado.sesion.id, tokenHash);

            this.logger.log(`Login exitoso para usuario ${datos.username}`, {
                userId: resultado.usuario.id,
                sessionId: resultado.sesion.id,
                ip: ipAddress,
                tokenExpiration: tokenInfo.expiresAt.toISOString()
            });

            // 4. Construir respuesta
            return new LoginResponseDto({
                token: tokenInfo.token,
                expiresAt: tokenInfo.expiresAt,
                usuario: resultado.usuario,
                sesion: resultado.sesion
            });

        } catch (error) {
            this.logger.error(`Error en login para usuario ${datos.username}: ${error.message}`, {
                ip: ipAddress,
                userAgent: userAgent,
                tipoError: error.constructor.name
            });
            throw error;
        }
    }

    private generarHashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}