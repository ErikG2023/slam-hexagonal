import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

// Importamos nuestro nuevo módulo de roles
import { RolModule } from './rol/infraestructura/config/rol.module';

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

    // Agregamos el módulo de roles a nuestra aplicación
    RolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }