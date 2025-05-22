import { Controller, Get, Post, Body, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    // Respuesta simple de string
    return this.appService.getHello();
  }

  @Get('usuarios')
  obtenerUsuarios() {
    // Respuesta con array de objetos
    return [
      { id: 1, nombre: 'Juan Pérez', email: 'juan@ejemplo.com' },
      { id: 2, nombre: 'María García', email: 'maria@ejemplo.com' },
    ];
  }

  @Get('usuario/:id')
  obtenerUsuario(@Param('id') id: string) {
    // Respuesta con objeto único
    if (isNaN(Number(id))) {
      throw new HttpException('El ID debe ser un número', HttpStatus.BAD_REQUEST);
    }
    return {
      id: Number(id),
      nombre: 'Usuario de ejemplo',
      email: 'usuario@ejemplo.com',
      fechaCreacion: new Date().toISOString()
    };
  }

  @Post('usuario')
  crearUsuario(@Body() datosUsuario: any) {
    // Respuesta de creación
    return {
      id: Math.floor(Math.random() * 1000),
      ...datosUsuario,
      fechaCreacion: new Date().toISOString()
    };
  }

  @Get('vacio')
  respuestaVacia() {
    // Probamos cómo maneja respuestas null/undefined
    return null;
  }
}