import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfiguracionAutenticacion } from '../../dominio/value-objects/configuracion-autenticacion.vo';

interface TokenBlacklistEntry {
    tokenHash: string;
    fechaVencimiento: Date;
    razon: string;
}

@Injectable()
export class BlacklistTokenService {
    private readonly logger = new Logger(BlacklistTokenService.name);
    private readonly blacklist = new Map<string, TokenBlacklistEntry>();

    constructor(
        private readonly configuracion: ConfiguracionAutenticacion
    ) { }

    agregarToken(
        tokenHash: string,
        fechaExpiracion: Date,
        razon: string = 'Logout manual'
    ): void {
        try {
            // Calculamos hasta cuándo mantener el token en blacklist
            const ahora = new Date();
            const tiempoRetencion = this.configuracion.blacklistRetentionMs;
            const fechaVencimiento = new Date(Math.max(
                fechaExpiracion.getTime(),
                ahora.getTime() + tiempoRetencion
            ));

            const entry: TokenBlacklistEntry = {
                tokenHash,
                fechaVencimiento,
                razon
            };

            this.blacklist.set(tokenHash, entry);

            this.logger.debug(`Token agregado a blacklist`, {
                tokenHash: tokenHash.substring(0, 10) + '...',
                fechaVencimiento: fechaVencimiento.toISOString(),
                razon,
                totalEnBlacklist: this.blacklist.size
            });

        } catch (error) {
            this.logger.error(`Error al agregar token a blacklist: ${error.message}`);
            throw new Error('Error interno al invalidar token');
        }
    }

    estaEnBlacklist(tokenHash: string): boolean {
        const entry = this.blacklist.get(tokenHash);

        if (!entry) {
            return false;
        }

        // Si el token ya venció en el blacklist, lo removemos
        if (new Date() > entry.fechaVencimiento) {
            this.blacklist.delete(tokenHash);
            this.logger.debug(`Token removido automáticamente del blacklist por vencimiento`);
            return false;
        }

        this.logger.debug(`Token encontrado en blacklist`, {
            tokenHash: tokenHash.substring(0, 10) + '...',
            razon: entry.razon
        });

        return true;
    }

    obtenerEstadisticas(): {
        totalTokensEnBlacklist: number;
        tokensVencidos: number;
        fechaProximaLimpieza: Date;
    } {
        const ahora = new Date();
        let tokensVencidos = 0;

        for (const [, entry] of this.blacklist) {
            if (ahora > entry.fechaVencimiento) {
                tokensVencidos++;
            }
        }

        // Calculamos próxima limpieza (cada hora)
        const proximaLimpieza = new Date();
        proximaLimpieza.setHours(proximaLimpieza.getHours() + 1, 0, 0, 0);

        return {
            totalTokensEnBlacklist: this.blacklist.size,
            tokensVencidos,
            fechaProximaLimpieza: proximaLimpieza
        };
    }

    limpiarTokensVencidos(): number {
        const ahora = new Date();
        let eliminados = 0;

        for (const [tokenHash, entry] of this.blacklist) {
            if (ahora > entry.fechaVencimiento) {
                this.blacklist.delete(tokenHash);
                eliminados++;
            }
        }

        if (eliminados > 0) {
            this.logger.log(`Limpieza de blacklist completada: ${eliminados} tokens eliminados`, {
                tokensRestantes: this.blacklist.size,
                tokensEliminados: eliminados
            });
        }

        return eliminados;
    }

    // Tarea programada para limpiar tokens vencidos cada hora
    @Cron(CronExpression.EVERY_HOUR)
    private async limpiezaAutomatica(): Promise<void> {
        try {
            const eliminados = this.limpiarTokensVencidos();

            if (eliminados > 0) {
                this.logger.debug(`Limpieza automática ejecutada: ${eliminados} tokens removidos`);
            }
        } catch (error) {
            this.logger.error(`Error en limpieza automática de blacklist: ${error.message}`);
        }
    }

    // Método para testing o administración manual
    limpiarTodo(): void {
        const total = this.blacklist.size;
        this.blacklist.clear();

        this.logger.log(`Blacklist completamente limpiado: ${total} tokens removidos`);
    }
}