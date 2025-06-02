import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GlobalAuditInterceptor implements NestInterceptor {
    private readonly logger = new Logger(GlobalAuditInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const user = request.user;

        // Solo procesar operaciones que modifican datos y tienen usuario autenticado
        if (user && this.isModifyingOperation(method, url)) {
            this.injectAuditData(request, user, method, url);
        }

        return next.handle().pipe(
            tap(() => {
                // Log opcional para ver qué se está auditando
                if (user && this.isModifyingOperation(method, url)) {
                    this.logger.debug(`Auditoría aplicada: ${method} ${url} por usuario ${user.id}`);
                }
            })
        );
    }

    private isModifyingOperation(method: string, url: string): boolean {
        // Operaciones que modifican datos
        const modifyingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

        // Excluir rutas que no necesitan auditoría (como auth)
        const excludedRoutes = ['/auth/login', '/auth/logout', '/auth/validate-session', '/auth/me'];

        return modifyingMethods.includes(method) && !excludedRoutes.some(route => url.includes(route));
    }

    private injectAuditData(request: any, user: any, method: string, url: string): void {
        const userId = user.id;

        // Inyectar datos de auditoría en el request (no en el body)
        request.auditUserId = userId;
        request.auditMethod = method;
        request.auditUrl = url;

        // Determinar tipo de operación para logging
        let operationType = 'UNKNOWN';
        switch (method) {
            case 'POST':
                operationType = 'CREATE';
                break;
            case 'PUT':
            case 'PATCH':
                operationType = url.includes('/restaurar') ? 'RESTORE' : 'UPDATE';
                break;
            case 'DELETE':
                operationType = 'DELETE';
                break;
        }

        request.auditOperationType = operationType;

        this.logger.debug(`Auditoría preparada: ${operationType} en ${url} por usuario ${userId}`);
    }
}