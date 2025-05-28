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

  // Configurar cookie parser  <- AGREGAR ESTAS LÍNEAS

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

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
}
bootstrap();