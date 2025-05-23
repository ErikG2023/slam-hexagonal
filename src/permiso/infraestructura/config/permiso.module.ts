import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos las entidades ORM para que TypeORM las reconozca
import { PermisoOrmEntity } from '../adaptadores/salida/repositorios/typeorm/entidades/permiso.orm-entity';

// Importamos el controlador que expondrá los endpoints
import { PermisoController } from '../adaptadores/entrada/controladores/permiso.controller';

// Importamos la implementación del repositorio
import { TypeOrmPermisoRepository } from '../adaptadores/salida/repositorios/typeorm/permiso.repository';

// Importamos el servicio de dominio
import { PermisoDominioService } from '../../dominio/servicios/permiso-dominio.service';

// Importamos todos los casos de uso
import { CrearPermisoCasoUso } from '../../aplicacion/casos-uso/crear-permiso.caso-uso';
import { ActualizarPermisoCasoUso } from '../../aplicacion/casos-uso/actualizar-permiso.caso-uso';
import { ObtenerPermisoCasoUso } from '../../aplicacion/casos-uso/obtener-permiso.caso-uso';
import { ListarPermisosCasoUso } from '../../aplicacion/casos-uso/listar-permisos.caso-uso';
import { EliminarPermisoCasoUso } from '../../aplicacion/casos-uso/eliminar-permiso.caso-uso';
import { RestaurarPermisoCasoUso } from '../../aplicacion/casos-uso/restaurar-permiso.caso-uso';

@Module({
    // Registramos las entidades ORM para que TypeORM pueda trabajar con ellas
    imports: [
        TypeOrmModule.forFeature([PermisoOrmEntity])
    ],

    // Declaramos qué controladores expondrá este módulo
    controllers: [
        PermisoController
    ],

    // Aquí es donde ocurre la magia de la inyección de dependencias
    providers: [
        // Registramos la implementación concreta del repositorio
        {
            provide: 'PermisoRepositorio',
            useClass: TypeOrmPermisoRepository,
        },

        // Registramos el servicio de dominio con su dependencia del repositorio
        {
            provide: PermisoDominioService,
            useFactory: (permisoRepositorio) => {
                return new PermisoDominioService(permisoRepositorio);
            },
            inject: ['PermisoRepositorio'],
        },

        // Registramos todos los casos de uso con sus respectivas dependencias
        {
            provide: CrearPermisoCasoUso,
            useFactory: (permisoDominioService) => {
                return new CrearPermisoCasoUso(permisoDominioService);
            },
            inject: [PermisoDominioService],
        },

        {
            provide: ActualizarPermisoCasoUso,
            useFactory: (permisoDominioService) => {
                return new ActualizarPermisoCasoUso(permisoDominioService);
            },
            inject: [PermisoDominioService],
        },

        {
            provide: ObtenerPermisoCasoUso,
            useFactory: (permisoRepositorio) => {
                return new ObtenerPermisoCasoUso(permisoRepositorio);
            },
            inject: ['PermisoRepositorio'],
        },

        {
            provide: ListarPermisosCasoUso,
            useFactory: (permisoRepositorio) => {
                return new ListarPermisosCasoUso(permisoRepositorio);
            },
            inject: ['PermisoRepositorio'],
        },

        {
            provide: EliminarPermisoCasoUso,
            useFactory: (permisoDominioService) => {
                return new EliminarPermisoCasoUso(permisoDominioService);
            },
            inject: [PermisoDominioService],
        },

        {
            provide: RestaurarPermisoCasoUso,
            useFactory: (permisoDominioService) => {
                return new RestaurarPermisoCasoUso(permisoDominioService);
            },
            inject: [PermisoDominioService],
        },
    ],

    // Exportamos servicios que otros módulos podrían necesitar
    exports: [
        'PermisoRepositorio',
        PermisoDominioService,
    ],
})
export class PermisoModule { }