import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

// Importamos nuestros módulos
import { RolModule } from './rol/infraestructura/config/rol.module';
import { PermisoModule } from './permiso/infraestructura/config/permiso.module';

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

    // Módulos de negocio
    RolModule,
    PermisoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }