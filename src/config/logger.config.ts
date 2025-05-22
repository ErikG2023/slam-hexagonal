import { LogLevel } from '@nestjs/common';

export class LoggerConfig {
    // Definimos los niveles de log según el entorno
    static getLogLevels(): LogLevel[] {
        const environment = process.env.NODE_ENV || 'development';

        switch (environment) {
            case 'production':
                // En producción solo queremos errores y warnings críticos
                return ['error', 'warn'];
            case 'test':
                // En testing solo errores para no contaminar los resultados
                return ['error'];
            case 'development':
            default:
                // En desarrollo queremos ver todo para debuggear
                return ['error', 'warn', 'log', 'debug', 'verbose'];
        }
    }

    // Configuramos el formato de timestamp personalizado
    static getTimestamp(): string {
        const now = new Date();
        return now.toISOString().replace('T', ' ').substring(0, 19);
    }
}