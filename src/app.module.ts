import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

// Importamos nuestros módulos
import { RolModule } from './rol/infraestructura/config/rol.module';
import { PermisoModule } from './permiso/infraestructura/config/permiso.module';
import { RolPermisoModule } from './rol-permiso/infraestructura/config/rol-permiso.module';
import { UsuarioModule } from './usuario/infraestructura/config/usuario.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AutenticacionModule } from './autenticacion/infraestructura/config/autenticacion.module';
import { GlobalAuditInterceptor } from './common/interceptors/global-audit.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthCommonModule } from './common/modules/auth-common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    ScheduleModule.forRoot(),

    // ✅ AGREGAR el módulo común de autorización
    AuthCommonModule,

    // Módulos de negocio
    RolModule,
    PermisoModule,
    RolPermisoModule,
    UsuarioModule,
    AutenticacionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Interceptor global de auditoría
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalAuditInterceptor,
    },


  ],
})
export class AppModule { }