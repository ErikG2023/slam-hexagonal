import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    Param,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ObtenerGestionPermisosRolCasoUso } from '../../../../aplicacion/casos-uso/obtener-gestion-permisos-rol.caso-uso';
import { SincronizarPermisosRolCasoUso } from '../../../../aplicacion/casos-uso/sincronizar-permisos-rol.caso-uso';
import { ValidarPermisosParaAsignacionCasoUso } from '../../../../aplicacion/casos-uso/validar-permisos-para-asignacion.caso-uso';
import { SincronizarPermisosRolDto } from '../../../../aplicacion/dtos/sincronizar-permisos-rol.dto';
import { AuditUser } from 'src/common/decorators/audit-user.decorator';

@Controller('roles')
export class RolPermisoController {
    constructor(
        private readonly obtenerGestionPermisosRolCasoUso: ObtenerGestionPermisosRolCasoUso,
        private readonly sincronizarPermisosRolCasoUso: SincronizarPermisosRolCasoUso,
        private readonly validarPermisosParaAsignacionCasoUso: ValidarPermisosParaAsignacionCasoUso,
    ) { }

    /**
     * GET /roles/:idRol/gestion-permisos
     * Obtiene toda la información necesaria para la pantalla de gestión de permisos.
     * Retorna el rol, permisos asignados y permisos disponibles.
     * 
     * Ejemplo: GET /roles/1/gestion-permisos
     */
    @Get(':idRol/gestion-permisos')
    async obtenerGestionPermisos(@Param('idRol', ParseIntPipe) idRol: number) {
        return await this.obtenerGestionPermisosRolCasoUso.ejecutar(idRol);
    }

    /**
     * PUT /roles/:idRol/permisos
     * Sincroniza todos los permisos del rol de una vez.
     * Recibe un array con los IDs de permisos que deben quedar asignados.
     * Elimina los no incluidos y agrega los nuevos.
     * 
     * Ejemplo: PUT /roles/1/permisos
     * Body: { "idsPermisosAsignados": [1, 3, 5, 7] }
     */
    @Put(':idRol/permisos')
    @HttpCode(HttpStatus.OK)
    async sincronizarPermisos(
        @Param('idRol', ParseIntPipe) idRol: number,
        @Body() sincronizarPermisosDto: SincronizarPermisosRolDto,
        @AuditUser() userId: number
    ) {
        return await this.sincronizarPermisosRolCasoUso.ejecutar(
            idRol,
            sincronizarPermisosDto,
            userId
        );
    }

    /**
     * POST /roles/:idRol/permisos/validar
     * Valida si los permisos pueden ser asignados al rol.
     * Útil para validaciones en tiempo real en el frontend.
     * 
     * Ejemplo: POST /roles/1/permisos/validar
     * Body: { "idsPermisosAsignados": [1, 3, 5, 999] }
     */
    @Post(':idRol/permisos/validar')
    @HttpCode(HttpStatus.OK)
    async validarPermisos(
        @Param('idRol', ParseIntPipe) idRol: number,
        @Body() datos: { idsPermisosAsignados: number[] },
    ) {
        // Validar que el body tenga la estructura esperada
        if (!Array.isArray(datos.idsPermisosAsignados)) {
            throw new Error('Se requiere un array de IDs de permisos');
        }

        return await this.validarPermisosParaAsignacionCasoUso.ejecutar(
            idRol,
            datos.idsPermisosAsignados
        );
    }
}