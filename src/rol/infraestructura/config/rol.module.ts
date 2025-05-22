import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos las entidades ORM para que TypeORM las reconozca
import { RolOrmEntity } from '../adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';

// Importamos el controlador que expondrá los endpoints
import { RolController } from '../adaptadores/entrada/controladores/rol.controller';

// Importamos la implementación del repositorio
import { TypeOrmRolRepository } from '../adaptadores/salida/repositorios/typeorm/rol.repository';

// Importamos el servicio de dominio
import { RolDominioService } from '../../dominio/servicios/rol-dominio.service';

// Importamos todos los casos de uso
import { CrearRolCasoUso } from '../../aplicacion/casos-uso/crear-rol.caso-uso';
import { ActualizarRolCasoUso } from '../../aplicacion/casos-uso/actualizar-rol.caso-uso';
import { ObtenerRolCasoUso } from '../../aplicacion/casos-uso/obtener-rol.caso-uso';
import { ListarRolesCasoUso } from '../../aplicacion/casos-uso/listar-roles.caso-uso';
import { EliminarRolCasoUso } from '../../aplicacion/casos-uso/eliminar-rol.caso-uso';
import { RestaurarRolCasoUso } from 'src/rol/aplicacion/casos-uso/restaurar-rol.caso-uso';

@Module({
    // Registramos las entidades ORM para que TypeORM pueda trabajar con ellas
    imports: [
        TypeOrmModule.forFeature([RolOrmEntity])
    ],

    // Declaramos qué controladores expondrá este módulo
    controllers: [
        RolController
    ],

    // Aquí es donde ocurre la magia de la inyección de dependencias
    providers: [
        // Registramos la implementación concreta del repositorio
        // usando el patrón de token personalizado para mantener la abstracción
        {
            provide: 'RolRepositorio', // Token que usaremos para inyectar
            useClass: TypeOrmRolRepository, // Implementación concreta
        },

        // Registramos el servicio de dominio con su dependencia del repositorio
        {
            provide: RolDominioService,
            useFactory: (rolRepositorio) => {
                return new RolDominioService(rolRepositorio);
            },
            inject: ['RolRepositorio'], // Inyectamos el repositorio usando el token
        },

        // Registramos todos los casos de uso con sus respectivas dependencias
        {
            provide: CrearRolCasoUso,
            useFactory: (rolDominioService) => {
                return new CrearRolCasoUso(rolDominioService);
            },
            inject: [RolDominioService],
        },

        {
            provide: ActualizarRolCasoUso,
            useFactory: (rolDominioService) => {
                return new ActualizarRolCasoUso(rolDominioService);
            },
            inject: [RolDominioService],
        },

        {
            provide: ObtenerRolCasoUso,
            useFactory: (rolRepositorio) => {
                // Este caso de uso accede directamente al repositorio para operaciones simples
                return new ObtenerRolCasoUso(rolRepositorio);
            },
            inject: ['RolRepositorio'],
        },

        {
            provide: ListarRolesCasoUso,
            useFactory: (rolRepositorio) => {
                return new ListarRolesCasoUso(rolRepositorio);
            },
            inject: ['RolRepositorio'],
        },

        {
            provide: EliminarRolCasoUso,
            useFactory: (rolDominioService) => {
                return new EliminarRolCasoUso(rolDominioService);
            },
            inject: [RolDominioService],
        },

        {
            provide: RestaurarRolCasoUso,
            useFactory: (rolDominioService) => {
                return new RestaurarRolCasoUso(rolDominioService);
            },
            inject: [RolDominioService],
        },
    ],

    // Exportamos servicios que otros módulos podrían necesitar
    exports: [
        'RolRepositorio',
        RolDominioService,
    ],
})
export class RolModule { }