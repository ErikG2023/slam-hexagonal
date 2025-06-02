import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Sesion, EstadoSesion } from '../entidades/sesion.entity';
import { ConfiguracionAutenticacion } from '../value-objects/configuracion-autenticacion.vo';
import { SesionRepositorio } from '../puertos/repositorios/sesion-repositorio.interface';
import { UsuarioRepositorio } from '../../../usuario/dominio/puertos/repositorios/usuario-repositorio.interface';
import {
    CredencialesInvalidasException,
    SesionNoEncontradaException,
    SesionExpiradaException,
    MaximoSesionesException,
    TokenInvalidoException,
    SesionDatosInvalidosException
} from '../excepciones/autenticacion-domain.exception';
import {
    UsuarioInactivoException,
    UsuarioBloqueadoException
} from '../../../usuario/dominio/excepciones/usuario-domain.exception';

export interface IniciarSesionDatos {
    username: string;
    password: string;
    ipAddress: string;
    userAgent: string;
    deviceId?: string;
    deviceName?: string;
}

export interface ResultadoLogin {
    sesion: Sesion;
    usuario: {
        id: number;
        username: string;
        nombreCompleto: string;
        email: string;
        rol: string;
    };
}

export interface ResultadoValidacion {
    valida: boolean;
    sesion?: Sesion;
    usuario?: {
        id: number;
        username: string;
        nombreCompleto: string;
        email: string;
        rol: string;
    };
    razon?: string;
}

export class AutenticacionDominioService {
    private readonly logger = new Logger(AutenticacionDominioService.name);

    constructor(
        private readonly usuarioRepositorio: UsuarioRepositorio,
        private readonly sesionRepositorio: SesionRepositorio,
        private readonly configuracion: ConfiguracionAutenticacion
    ) { }

    async iniciarSesion(datos: IniciarSesionDatos): Promise<ResultadoLogin> {
        try {
            this.logger.log(`Iniciando sesión para usuario: ${datos.username}`);

            // 1. Validar credenciales
            const usuario = await this.validarCredenciales(datos.username, datos.password);

            // 2. Validar estado del usuario
            await this.validarEstadoUsuario(usuario);

            // 3. Gestionar límite de sesiones
            await this.gestionarLimiteSesiones(usuario.id);

            // 4. Crear nueva sesión
            const sesion = await this.crearNuevaSesion(usuario.id, datos);

            this.logger.log(`Sesión iniciada exitosamente para usuario ${datos.username}`, {
                userId: usuario.id,
                sessionId: sesion.id,
                ip: datos.ipAddress
            });

            return {
                sesion,
                usuario: {
                    id: usuario.id,
                    username: usuario.username,
                    nombreCompleto: usuario.nombreCompleto, // Ya viene completo de buscarConDetalles
                    email: usuario.email,
                    rol: usuario.nombreRol // Cambiar de usuario.rol.nombre a usuario.nombreRol
                }
            };

        } catch (error) {
            this.logger.warn(`Fallo en inicio de sesión para ${datos.username}: ${error.message}`, {
                ip: datos.ipAddress,
                userAgent: datos.userAgent
            });
            throw error;
        }
    }

    async validarSesion(sessionId: string, tokenHash: string): Promise<ResultadoValidacion> {
        try {
            // 1. Buscar sesión por ID
            const sesion = await this.sesionRepositorio.buscarPorId(sessionId);
            if (!sesion) {
                return { valida: false, razon: 'SESION_NO_ENCONTRADA' };
            }

            // 2. Verificar hash del token
            if (sesion.tokenHash !== tokenHash) {
                return { valida: false, razon: 'TOKEN_HASH_INVALIDO' };
            }

            // 3. Verificar estado de la sesión
            if (!sesion.puedeSerUsada()) {
                return { valida: false, razon: 'SESION_NO_USABLE' };
            }

            // 4. Obtener datos del usuario
            const usuarioConDetalles = await this.usuarioRepositorio.buscarConDetalles(sesion.idUsuario);
            if (!usuarioConDetalles) {
                return { valida: false, razon: 'USUARIO_NO_ENCONTRADO' };
            }

            // 5. Verificar estado del usuario
            if (!usuarioConDetalles.activo) {
                return { valida: false, razon: 'USUARIO_INACTIVO' };
            }

            if (usuarioConDetalles.bloqueado) {
                return { valida: false, razon: 'USUARIO_BLOQUEADO' };
            }

            // 6. Actualizar actividad de la sesión
            sesion.actualizarActividad();
            await this.sesionRepositorio.guardar(sesion);

            return {
                valida: true,
                sesion,
                usuario: {
                    id: usuarioConDetalles.id,
                    username: usuarioConDetalles.username,
                    nombreCompleto: usuarioConDetalles.nombreCompleto,
                    email: usuarioConDetalles.email,
                    rol: usuarioConDetalles.nombreRol
                }
            };

        } catch (error) {
            this.logger.error(`Error validando sesión ${sessionId}: ${error.message}`);
            return { valida: false, razon: 'ERROR_INTERNO' };
        }
    }

    async cerrarSesion(sessionId: string): Promise<void> {
        try {
            const sesion = await this.sesionRepositorio.buscarPorId(sessionId);
            if (!sesion) {
                throw new SesionNoEncontradaException(sessionId);
            }

            sesion.cerrar();
            await this.sesionRepositorio.guardar(sesion);

            this.logger.log(`Sesión cerrada: ${sessionId}`, {
                userId: sesion.idUsuario
            });

        } catch (error) {
            this.logger.error(`Error cerrando sesión ${sessionId}: ${error.message}`);
            throw error;
        }
    }

    // Métodos privados de validación
    private async validarCredenciales(username: string, password: string): Promise<any> {
        // 1. Buscar usuario básico para validar password
        const usuarioBasico = await this.usuarioRepositorio.buscarPorUsername(username);
        if (!usuarioBasico) {
            throw new CredencialesInvalidasException();
        }

        // 2. Validar password
        const passwordValida = await bcrypt.compare(password, usuarioBasico.password);
        if (!passwordValida) {
            throw new CredencialesInvalidasException();
        }

        // 3. Obtener datos completos del usuario
        const usuarioCompleto = await this.usuarioRepositorio.buscarConDetalles(usuarioBasico.id);
        if (!usuarioCompleto) {
            throw new CredencialesInvalidasException();
        }

        return usuarioCompleto;
    }

    private async validarEstadoUsuario(usuario: any): Promise<void> {
        if (!usuario.activo) {
            throw new UsuarioInactivoException(usuario.id);
        }

        if (usuario.bloqueado) {
            throw new UsuarioBloqueadoException(usuario.username);
        }
    }

    private async gestionarLimiteSesiones(userId: number): Promise<void> {
        const sesionesActivas = await this.sesionRepositorio.contarSesionesActivasDeUsuario(userId);

        if (sesionesActivas >= this.configuracion.maxSessionsPerUser) {
            // Cerrar la sesión más antigua
            await this.sesionRepositorio.cerrarSesionMasAntigua(userId);
            this.logger.log(`Sesión más antigua cerrada para usuario ${userId} - límite alcanzado`);
        }
    }

    private async crearNuevaSesion(userId: number, datos: IniciarSesionDatos): Promise<Sesion> {
        const ahora = new Date();
        const expiracion = new Date(ahora.getTime() + this.configuracion.sessionDurationMs);

        // Generar un hash temporal - será reemplazado por el hash real del JWT
        const tokenHashTemporal = this.generarTokenHash();

        const sesion = new Sesion({
            idUsuario: userId,
            tokenHash: tokenHashTemporal, // Este será actualizado después
            ipAddress: datos.ipAddress,
            userAgent: datos.userAgent,
            fechaExpiracion: expiracion,
            deviceId: datos.deviceId,
            deviceName: datos.deviceName
        });

        return await this.sesionRepositorio.guardar(sesion);
    }

    async actualizarHashSesion(sessionId: string, tokenHash: string): Promise<void> {
        const sesion = await this.sesionRepositorio.buscarPorId(sessionId);
        if (!sesion) {
            throw new SesionNoEncontradaException(sessionId);
        }

        // Crear nueva instancia con el hash correcto
        const sesionActualizada = new Sesion({
            id: sesion.id,
            idUsuario: sesion.idUsuario,
            tokenHash: tokenHash, // El hash real del JWT
            ipAddress: sesion.ipAddress,
            userAgent: sesion.userAgent,
            fechaCreacion: sesion.fechaCreacion,
            fechaExpiracion: sesion.fechaExpiracion,
            ultimaActividad: sesion.ultimaActividad,
            estado: sesion.estado,
            deviceId: sesion.deviceId,
            deviceName: sesion.deviceName
        });

        await this.sesionRepositorio.guardar(sesionActualizada);
    }

    private generarTokenHash(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}