import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos las entidades ORM necesarias
import { UsuarioOrmEntity } from '../adaptadores/salida/repositorios/typeorm/entidades/usuario.orm-entity';
import { PersonaOrmEntity } from '../adaptadores/salida/repositorios/typeorm/entidades/persona.orm-entity';
import { RolOrmEntity } from '../../../rol/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';

// Importamos el controlador
import { UsuarioController } from '../adaptadores/entrada/controladores/usuario.controller';

// Importamos la implementación del repositorio
import { TypeOrmUsuarioRepository } from '../adaptadores/salida/repositorios/typeorm/usuario.repository';

// Importamos el servicio de dominio
import { UsuarioDominioService } from '../../dominio/servicios/usuario-dominio.service';

// Importamos todos los casos de uso
import { CrearUsuarioCasoUso } from '../../aplicacion/casos-uso/crear-usuario.caso-uso';
import { ActualizarUsuarioCasoUso } from '../../aplicacion/casos-uso/actualizar-usuario.caso-uso';
import { CambiarPasswordCasoUso } from '../../aplicacion/casos-uso/cambiar-password.caso-uso';
import { ObtenerUsuarioCasoUso } from '../../aplicacion/casos-uso/obtener-usuario.caso-uso';
import { ListarUsuariosCasoUso } from '../../aplicacion/casos-uso/listar-usuarios.caso-uso';
import { EliminarUsuarioCasoUso } from '../../aplicacion/casos-uso/eliminar-usuario.caso-uso';
import { RestaurarUsuarioCasoUso } from '../../aplicacion/casos-uso/restaurar-usuario.caso-uso';
import { BloquearUsuarioCasoUso } from '../../aplicacion/casos-uso/bloquear-usuario.caso-uso';
import { DesbloquearUsuarioCasoUso } from '../../aplicacion/casos-uso/desbloquear-usuario.caso-uso';

@Module({
    // Registramos todas las entidades ORM que necesitamos
    imports: [
        TypeOrmModule.forFeature([
            UsuarioOrmEntity,
            PersonaOrmEntity,
            RolOrmEntity
        ])
    ],

    // Declaramos el controlador
    controllers: [
        UsuarioController
    ],

    // Configuramos la inyección de dependencias
    providers: [
        // Registramos la implementación del repositorio
        {
            provide: 'UsuarioRepositorio',
            useClass: TypeOrmUsuarioRepository,
        },

        // Registramos el servicio de dominio
        {
            provide: UsuarioDominioService,
            useFactory: (usuarioRepositorio) => {
                return new UsuarioDominioService(usuarioRepositorio);
            },
            inject: ['UsuarioRepositorio'],
        },

        // Registramos todos los casos de uso
        {
            provide: CrearUsuarioCasoUso,
            useFactory: (usuarioDominioService) => {
                return new CrearUsuarioCasoUso(usuarioDominioService);
            },
            inject: [UsuarioDominioService],
        },

        {
            provide: ActualizarUsuarioCasoUso,
            useFactory: (usuarioDominioService) => {
                return new ActualizarUsuarioCasoUso(usuarioDominioService);
            },
            inject: [UsuarioDominioService],
        },

        {
            provide: CambiarPasswordCasoUso,
            useFactory: (usuarioDominioService) => {
                return new CambiarPasswordCasoUso(usuarioDominioService);
            },
            inject: [UsuarioDominioService],
        },

        {
            provide: ObtenerUsuarioCasoUso,
            useFactory: (usuarioRepositorio) => {
                return new ObtenerUsuarioCasoUso(usuarioRepositorio);
            },
            inject: ['UsuarioRepositorio'],
        },

        {
            provide: ListarUsuariosCasoUso,
            useFactory: (usuarioRepositorio) => {
                return new ListarUsuariosCasoUso(usuarioRepositorio);
            },
            inject: ['UsuarioRepositorio'],
        },

        {
            provide: EliminarUsuarioCasoUso,
            useFactory: (usuarioDominioService) => {
                return new EliminarUsuarioCasoUso(usuarioDominioService);
            },
            inject: [UsuarioDominioService],
        },

        {
            provide: RestaurarUsuarioCasoUso,
            useFactory: (usuarioDominioService) => {
                return new RestaurarUsuarioCasoUso(usuarioDominioService);
            },
            inject: [UsuarioDominioService],
        },

        {
            provide: BloquearUsuarioCasoUso,
            useFactory: (usuarioDominioService) => {
                return new BloquearUsuarioCasoUso(usuarioDominioService);
            },
            inject: [UsuarioDominioService],
        },

        {
            provide: DesbloquearUsuarioCasoUso,
            useFactory: (usuarioDominioService) => {
                return new DesbloquearUsuarioCasoUso(usuarioDominioService);
            },
            inject: [UsuarioDominioService],
        },
    ],

    // Exportamos servicios que otros módulos podrían necesitar
    exports: [
        'UsuarioRepositorio',
        UsuarioDominioService,
    ],
})
export class UsuarioModule { }