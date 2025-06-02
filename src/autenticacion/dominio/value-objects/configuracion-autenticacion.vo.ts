export class ConfiguracionAutenticacion {
    private readonly _jwtSecret: string;
    private readonly _sessionDurationMinutes: number;
    private readonly _maxSessionsPerUser: number;
    private readonly _blacklistRetentionHours: number;

    constructor(params: {
        jwtSecret: string;
        sessionDurationMinutes: number;
        maxSessionsPerUser: number;
        blacklistRetentionHours: number;
    }) {
        this.validarParametros(params);

        this._jwtSecret = params.jwtSecret;
        this._sessionDurationMinutes = params.sessionDurationMinutes;
        this._maxSessionsPerUser = params.maxSessionsPerUser;
        this._blacklistRetentionHours = params.blacklistRetentionHours;
    }

    get jwtSecret(): string { return this._jwtSecret; }
    get sessionDurationMinutes(): number { return this._sessionDurationMinutes; }
    get maxSessionsPerUser(): number { return this._maxSessionsPerUser; }
    get blacklistRetentionHours(): number { return this._blacklistRetentionHours; }

    // Métodos de conveniencia
    get sessionDurationMs(): number {
        return this._sessionDurationMinutes * 60 * 1000;
    }

    get blacklistRetentionMs(): number {
        return this._blacklistRetentionHours * 60 * 60 * 1000;
    }

    private validarParametros(params: any): void {
        if (!params.jwtSecret || params.jwtSecret.length < 32) {
            throw new Error('JWT secret debe tener al menos 32 caracteres');
        }

        if (params.sessionDurationMinutes <= 0 || params.sessionDurationMinutes > 1440) {
            throw new Error('Duración de sesión debe estar entre 1 y 1440 minutos');
        }

        if (params.maxSessionsPerUser <= 0 || params.maxSessionsPerUser > 10) {
            throw new Error('Máximo sesiones por usuario debe estar entre 1 y 10');
        }

        if (params.blacklistRetentionHours <= 0 || params.blacklistRetentionHours > 168) {
            throw new Error('Retención de blacklist debe estar entre 1 y 168 horas');
        }
    }
}