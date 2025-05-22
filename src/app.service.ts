import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    // Probamos diferentes niveles de log
    this.logger.verbose('Mensaje muy detallado para debugging profundo');
    this.logger.debug('Información de debug para desarrollo');
    this.logger.log('Información general del flujo de la aplicación');
    this.logger.warn('Advertencia: algo puede no estar bien');

    return 'Hello World!';
  }
}