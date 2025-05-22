import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerConfig } from './config/logger.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerConfig.getLogLevels(),
  });

  // Aplicamos nuestras configuraciones globales en el orden correcto
  app.useGlobalFilters(new GlobalExceptionFilter()); // Primero los errores
  app.useGlobalInterceptors(new ResponseTransformInterceptor()); // Luego las respuestas exitosas

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Aplicación iniciada en puerto ${port}`);
  logger.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🗄️  Base de datos: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  logger.log(`✅ Configuraciones globales aplicadas: Logging, Errores, Respuestas`);
}
bootstrap();