export class ResultadoSincronizacionDto {
    idRol: number;
    nombreRol: string;
    permisosAsignados: number;
    permisosRemovidos: number;
    permisosAgregados: number;
    fechaSincronizacion: string;
    sincronizadoPor: number;
    mensaje: string;

    constructor(data: {
        idRol: number;
        nombreRol: string;
        permisosAsignados: number;
        permisosRemovidos: number;
        permisosAgregados: number;
        sincronizadoPor: number;
    }) {
        this.idRol = data.idRol;
        this.nombreRol = data.nombreRol;
        this.permisosAsignados = data.permisosAsignados;
        this.permisosRemovidos = data.permisosRemovidos;
        this.permisosAgregados = data.permisosAgregados;
        this.fechaSincronizacion = new Date().toISOString();
        this.sincronizadoPor = data.sincronizadoPor;
        this.mensaje = `Permisos del rol "${data.nombreRol}" sincronizados exitosamente. ${data.permisosAgregados} agregados, ${data.permisosRemovidos} removidos.`;
    }
}