import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos las entidades ORM necesarias
import { RolPermisoOrmEntity } from '../adaptadores/salida/repositorios/typeorm/entidades/rol-permiso.orm-entity';
import { RolOrmEntity } from '../../../rol/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';
import { PermisoOrmEntity } from '../../../permiso/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/permiso.orm-entity';

// Importamos el controlador
import { RolPermisoController } from '../adaptadores/entrada/controladores/rol-permiso.controller';

// Importamos la implementación del repositorio
import { TypeOrmRolPermisoRepository } from '../adaptadores/salida/repositorios/typeorm/rol-permiso.repository';

// Importamos todos los casos de uso
import { ObtenerGestionPermisosRolCasoUso } from '../../aplicacion/casos-uso/obtener-gestion-permisos-rol.caso-uso';
import { SincronizarPermisosRolCasoUso } from '../../aplicacion/casos-uso/sincronizar-permisos-rol.caso-uso';
import { ValidarPermisosParaAsignacionCasoUso } from '../../aplicacion/casos-uso/validar-permisos-para-asignacion.caso-uso';

@Module({
    // Registramos todas las entidades ORM que necesitamos
    imports: [
        TypeOrmModule.forFeature([
            RolPermisoOrmEntity,
            RolOrmEntity,
            PermisoOrmEntity
        ])
    ],

    // Declaramos el controlador
    controllers: [
        RolPermisoController
    ],

    // Configuramos la inyección de dependencias
    providers: [
        // Registramos la implementación del repositorio
        {
            provide: 'RolPermisoRepositorio',
            useClass: TypeOrmRolPermisoRepository,
        },

        // Registramos los casos de uso
        {
            provide: ObtenerGestionPermisosRolCasoUso,
            useFactory: (rolPermisoRepositorio) => {
                return new ObtenerGestionPermisosRolCasoUso(rolPermisoRepositorio);
            },
            inject: ['RolPermisoRepositorio'],
        },

        {
            provide: SincronizarPermisosRolCasoUso,
            useFactory: (rolPermisoRepositorio) => {
                return new SincronizarPermisosRolCasoUso(rolPermisoRepositorio);
            },
            inject: ['RolPermisoRepositorio'],
        },

        {
            provide: ValidarPermisosParaAsignacionCasoUso,
            useFactory: (rolPermisoRepositorio) => {
                return new ValidarPermisosParaAsignacionCasoUso(rolPermisoRepositorio);
            },
            inject: ['RolPermisoRepositorio'],
        },
    ],

    // Exportamos servicios que otros módulos podrían necesitar
    exports: [
        'RolPermisoRepositorio',
    ],
})
export class RolPermisoModule { }