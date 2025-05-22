import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

// Definimos la estructura estándar de nuestras respuestas exitosas
export interface StandardResponse<T> {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    data: T;
    message?: string;
}

@Injectable()
export class ResponseTransformInterceptor<T>
    implements NestInterceptor<T, StandardResponse<T>> {

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<StandardResponse<T>> {
        // Obtenemos información del contexto de la petición
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse();

        // Ejecutamos el handler y transformamos la respuesta
        return next.handle().pipe(
            map((data) => {
                // Este es el corazón del interceptor: transformamos cualquier respuesta
                // a nuestro formato estándar
                return this.transformResponse(data, request, response.statusCode);
            }),
        );
    }

    private transformResponse<T>(
        data: T,
        request: Request,
        statusCode: number,
    ): StandardResponse<T> {
        // Construimos la respuesta estándar que siempre tendrá la misma estructura
        return {
            success: true, // Para respuestas exitosas, siempre es true
            statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            data: this.processData(data), // Procesamos los datos según el tipo
            message: this.generateSuccessMessage(request.method), // Mensaje contextual
        };
    }

    private processData<T>(data: T): T {
        // Si los datos ya vienen en el formato que esperamos, los retornamos tal como están
        if (data === null || data === undefined) {
            return data;
        }

        // Si es un array, podríamos agregar metadatos como count en el futuro
        if (Array.isArray(data)) {
            return data;
        }

        // Para objetos simples, los retornamos sin modificaciones
        return data;
    }

    private generateSuccessMessage(method: string): string {
        // Generamos mensajes contextualmente útiles basados en el método HTTP
        const methodMessages: Record<string, string> = {
            GET: 'Datos obtenidos exitosamente',
            POST: 'Recurso creado exitosamente',
            PUT: 'Recurso actualizado exitosamente',
            PATCH: 'Recurso actualizado parcialmente',
            DELETE: 'Recurso eliminado exitosamente',
        };

        return methodMessages[method] || 'Operación completada exitosamente';
    }
}