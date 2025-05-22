import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    // Validamos que las variables de entorno existan
    const host = configService.get<string>('DB_HOST');
    const port = configService.get<string>('DB_PORT');
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const database = configService.get<string>('DB_DATABASE');

    // Si alguna variable crítica no existe, lanzamos un error explicativo
    if (!host || !port || !username || !password || !database) {
        throw new Error('Variables de entorno de base de datos no configuradas correctamente');
    }

    return {
        type: 'postgres',
        host,
        port: parseInt(port, 10), // Ahora sabemos que port no es undefined
        username,
        password,
        database,
        autoLoadEntities: true, // Carga automáticamente las entidades registradas
        synchronize: false, // No modifica la estructura existente de la BD
        logging: process.env.NODE_ENV === 'development', // Solo log en desarrollo
    };
};