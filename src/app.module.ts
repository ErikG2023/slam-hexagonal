import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explícitamente indicamos el archivo
    }),
    // Configuración de TypeORM usando factory pattern
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importamos ConfigModule para usar ConfigService
      inject: [ConfigService], // Inyectamos ConfigService como dependencia
      useFactory: databaseConfig, // Usamos nuestra función de configuración
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }