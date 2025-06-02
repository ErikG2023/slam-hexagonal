import {
    Controller,
    Post,
    Get,
    Body,
    Headers,
    Ip,
    Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { IniciarSesionCasoUso } from '../../../../aplicacion/casos-uso/iniciar-sesion.caso-uso';
import { ValidarSesionCasoUso } from '../../../../aplicacion/casos-uso/validar-sesion.caso-uso';
import { CerrarSesionCasoUso } from '../../../../aplicacion/casos-uso/cerrar-sesion.caso-uso';
import { LoginRequestDto } from '../../../../aplicacion/dtos/login-request.dto';
import { Public } from 'src/autenticacion/infraestructura/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly iniciarSesionCasoUso: IniciarSesionCasoUso,
        private readonly validarSesionCasoUso: ValidarSesionCasoUso,
        private readonly cerrarSesionCasoUso: CerrarSesionCasoUso,
    ) { }

    /**
     * POST /auth/login
     * Inicia sesión con username y password.
     * Retorna JWT token y datos del usuario.
     */
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginRequestDto,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string = '',
        @Req() request: Request,
    ) {
        const ipAddress = this.obtenerIpReal(request, ip);

        // Auto-detectar device info si no se proporciona
        const deviceName = loginDto.deviceName || this.detectarDispositivo(userAgent);
        const deviceId = loginDto.deviceId || this.generarDeviceId(userAgent, ipAddress);

        return await this.iniciarSesionCasoUso.ejecutar(
            {
                ...loginDto,
                deviceName,
                deviceId
            },
            ipAddress,
            userAgent
        );
    }

    /**
     * GET /auth/validate-session
     * Valida si la sesión actual es válida.
     * Requiere header Authorization: Bearer {token}
     */
    @Get('validate-session')
    async validarSesion(
        @Headers('authorization') authorization: string,
    ) {
        return await this.validarSesionCasoUso.ejecutar(authorization);
    }

    /**
     * POST /auth/logout
     * Cierra la sesión actual e invalida el token.
     * Requiere header Authorization: Bearer {token}
     */
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @Headers('authorization') authorization: string,
    ) {
        return await this.cerrarSesionCasoUso.ejecutar(authorization);
    }

    /**
     * GET /auth/me
     * Obtiene información del usuario actual.
     * Es un alias de validate-session pero con respuesta más limpia.
     */
    @Get('me')
    async obtenerUsuarioActual(
        @Headers('authorization') authorization: string,
    ) {
        const resultado = await this.validarSesionCasoUso.ejecutar(authorization);

        if (!resultado.valid) {
            // Si no es válida, devolver la respuesta tal como está
            return resultado;
        }

        // Si es válida, devolver solo los datos del usuario
        return {
            valid: true,
            usuario: resultado.usuario,
            session: {
                expiresAt: resultado.session?.expiresAt,
                tiempoRestante: resultado.session?.tiempoRestante
            }
        };
    }

    /**
 * Obtiene la IP real del cliente considerando proxies y load balancers.
 */
    private obtenerIpReal(request: Request, fallbackIp: string): string {
        // Verificar headers comunes de proxies
        const xForwardedFor = request.headers['x-forwarded-for'];
        const xRealIp = request.headers['x-real-ip'];
        const cfConnectingIp = request.headers['cf-connecting-ip']; // Cloudflare

        if (typeof xForwardedFor === 'string') {
            // X-Forwarded-For puede contener múltiples IPs separadas por coma
            const ips = xForwardedFor.split(',').map(ip => ip.trim());
            return ips[0]; // La primera IP es la del cliente original
        }

        if (typeof xRealIp === 'string') {
            return xRealIp;
        }

        if (typeof cfConnectingIp === 'string') {
            return cfConnectingIp;
        }

        // Si no hay headers de proxy, usar la IP directa
        return fallbackIp || request.socket?.remoteAddress || 'unknown';
    }

    private detectarDispositivo(userAgent: string): string {
        // Detección básica basada en User-Agent
        if (userAgent.includes('Mobile')) return 'Móvil';
        if (userAgent.includes('Tablet')) return 'Tablet';
        if (userAgent.includes('Windows')) return 'PC Windows';
        if (userAgent.includes('Mac')) return 'Mac';
        if (userAgent.includes('Linux')) return 'PC Linux';
        if (userAgent.includes('Postman')) return 'Postman';
        return 'Dispositivo desconocido';
    }

    private generarDeviceId(userAgent: string, ip: string): string {
        // Generar ID único basado en características del dispositivo
        const crypto = require('crypto');
        const data = `${userAgent}-${ip}`;
        return crypto.createHash('md5').update(data).digest('hex').substring(0, 16);
    }
}