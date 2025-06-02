import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importar entidades necesarias
import { UsuarioOrmEntity } from '../../usuario/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/usuario.orm-entity';

// Importar servicios y guards
import { UserPermissionsService } from '../services/user-permissions.service';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

@Global() // Hace que este módulo esté disponible globalmente
@Module({
    imports: [
        // Registrar las entidades que necesita UserPermissionsService
        TypeOrmModule.forFeature([UsuarioOrmEntity]),
    ],
    providers: [
        UserPermissionsService,
        RolesGuard,
        PermissionsGuard,
    ],
    exports: [
        UserPermissionsService,
        RolesGuard,
        PermissionsGuard,
    ],
})
export class AuthCommonModule { }