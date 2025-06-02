import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos las entidades ORM necesarias
import { SesionOrmEntity } from '../adaptadores/salida/repositorios/typeorm/entidades/sesion.orm-entity';
import { UsuarioOrmEntity } from '../../../usuario/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/usuario.orm-entity';
import { PersonaOrmEntity } from '../../../usuario/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/persona.orm-entity';
import { RolOrmEntity } from '../../../rol/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';

// Importamos el controlador
import { AuthController } from '../adaptadores/entrada/controladores/auth.controller';

// Importamos las implementaciones de repositorios
import { TypeOrmSesionRepository } from '../adaptadores/salida/repositorios/typeorm/sesion.repository';
import { TypeOrmUsuarioRepository } from '../../../usuario/infraestructura/adaptadores/salida/repositorios/typeorm/usuario.repository';

// Importamos servicios de infraestructura
import { JwtService } from '../servicios/jwt.service';
import { BlacklistTokenService } from '../servicios/blacklist-token.service';

// Importamos el servicio de dominio
import { AutenticacionDominioService } from '../../dominio/servicios/autenticacion-dominio.service';

// Importamos value objects
import { ConfiguracionAutenticacion } from '../../dominio/value-objects/configuracion-autenticacion.vo';

// Importamos casos de uso
import { IniciarSesionCasoUso } from '../../aplicacion/casos-uso/iniciar-sesion.caso-uso';
import { ValidarSesionCasoUso } from '../../aplicacion/casos-uso/validar-sesion.caso-uso';
import { CerrarSesionCasoUso } from '../../aplicacion/casos-uso/cerrar-sesion.caso-uso';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
    // Registramos las entidades ORM necesarias
    imports: [
        TypeOrmModule.forFeature([
            SesionOrmEntity,
            UsuarioOrmEntity,
            PersonaOrmEntity,
            RolOrmEntity
        ]),
        ConfigModule
    ],

    // Declaramos el controlador
    controllers: [
        AuthController
    ],

    // Configuramos la inyección de dependencias
    providers: [
        // Configuración de autenticación usando variables de entorno
        {
            provide: ConfiguracionAutenticacion,
            useFactory: (configService: ConfigService) => {
                return new ConfiguracionAutenticacion({
                    jwtSecret: configService.get<string>('JWT_SECRET') || 'default-secret-key-change-in-production',
                    sessionDurationMinutes: parseInt(configService.get<string>('JWT_SESSION_DURATION_MINUTES') || '60'),
                    maxSessionsPerUser: parseInt(configService.get<string>('MAX_SESSIONS_PER_USER') || '3'),
                    blacklistRetentionHours: parseInt(configService.get<string>('TOKEN_BLACKLIST_RETENTION_HOURS') || '24'),
                });
            },
            inject: [ConfigService],
        },

        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },

        // Repositorios
        {
            provide: 'SesionRepositorio',
            useClass: TypeOrmSesionRepository,
        },
        {
            provide: 'UsuarioRepositorio',
            useClass: TypeOrmUsuarioRepository,
        },

        // Servicios de infraestructura
        JwtService,
        BlacklistTokenService,

        // Servicio de dominio
        {
            provide: AutenticacionDominioService,
            useFactory: (usuarioRepositorio, sesionRepositorio, configuracion) => {
                return new AutenticacionDominioService(usuarioRepositorio, sesionRepositorio, configuracion);
            },
            inject: ['UsuarioRepositorio', 'SesionRepositorio', ConfiguracionAutenticacion],
        },

        // Casos de uso
        {
            provide: IniciarSesionCasoUso,
            useFactory: (autenticacionDominioService, jwtService) => {
                return new IniciarSesionCasoUso(autenticacionDominioService, jwtService);
            },
            inject: [AutenticacionDominioService, JwtService],
        },

        {
            provide: ValidarSesionCasoUso,
            useFactory: (autenticacionDominioService, jwtService, blacklistTokenService) => {
                return new ValidarSesionCasoUso(autenticacionDominioService, jwtService, blacklistTokenService);
            },
            inject: [AutenticacionDominioService, JwtService, BlacklistTokenService],
        },

        {
            provide: CerrarSesionCasoUso,
            useFactory: (autenticacionDominioService, jwtService, blacklistTokenService) => {
                return new CerrarSesionCasoUso(autenticacionDominioService, jwtService, blacklistTokenService);
            },
            inject: [AutenticacionDominioService, JwtService, BlacklistTokenService],
        },
    ],

    // Exportamos servicios que otros módulos podrían necesitar
    exports: [
        'SesionRepositorio',
        AutenticacionDominioService,
        JwtService,
        BlacklistTokenService,
    ],
})
export class AutenticacionModule { }