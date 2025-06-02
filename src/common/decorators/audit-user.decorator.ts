import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuditUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): number => {
        const request = ctx.switchToHttp().getRequest();
        const userId = request.auditUserId;

        if (!userId) {
            throw new Error('Usuario de auditoría no encontrado. Asegúrate de que la ruta esté protegida.');
        }

        return userId;
    },
);