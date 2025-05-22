import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Body,
    Param,
    Query,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { CrearRolCasoUso } from '../../../../aplicacion/casos-uso/crear-rol.caso-uso';
import { ActualizarRolCasoUso } from '../../../../aplicacion/casos-uso/actualizar-rol.caso-uso';
import { ObtenerRolCasoUso } from '../../../../aplicacion/casos-uso/obtener-rol.caso-uso';
import { ListarRolesCasoUso, FiltrosListarRoles, TipoFiltroEstado } from '../../../../aplicacion/casos-uso/listar-roles.caso-uso';
import { EliminarRolCasoUso } from '../../../../aplicacion/casos-uso/eliminar-rol.caso-uso';
import { RestaurarRolCasoUso } from '../../../../aplicacion/casos-uso/restaurar-rol.caso-uso';
import { CrearRolDto } from '../../../../aplicacion/dtos/crear-rol.dto';
import { ActualizarRolDto } from '../../../../aplicacion/dtos/actualizar-rol.dto';

@Controller('roles')
export class RolController {
    constructor(
        private readonly crearRolCasoUso: CrearRolCasoUso,
        private readonly actualizarRolCasoUso: ActualizarRolCasoUso,
        private readonly obtenerRolCasoUso: ObtenerRolCasoUso,
        private readonly listarRolesCasoUso: ListarRolesCasoUso,
        private readonly eliminarRolCasoUso: EliminarRolCasoUso,
        private readonly restaurarRolCasoUso: RestaurarRolCasoUso, // Nueva dependencia
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() crearRolDto: CrearRolDto) {
        const idUsuarioEjecutor = 1;
        return await this.crearRolCasoUso.ejecutar(crearRolDto, idUsuarioEjecutor);
    }

    /**
     * GET /roles
     * Lista roles con filtros mejorados y paginación.
     * 
     * Ejemplos de uso mejorados:
     * - GET /roles (solo roles activos, comportamiento por defecto)
     * - GET /roles?estado=activos (explícitamente solo activos)
     * - GET /roles?estado=eliminados (solo roles eliminados/inactivos)
     * - GET /roles?estado=todos (todos los roles sin importar estado)
     * - GET /roles?estado=activos&nombre=admin (buscar "admin" solo en activos)
     * - GET /roles?limite=5&offset=10&estado=todos (paginación con todos los estados)
     */
    @Get()
    async listar(
        @Query('estado') estado?: string,
        @Query('nombre') nombre?: string,
        @Query('limite') limite?: string,
        @Query('offset') offset?: string,
    ) {
        const filtros: FiltrosListarRoles = {};

        // Validamos y convertimos el parámetro de estado
        if (estado) {
            // Verificamos que el estado solicitado sea válido
            const estadosValidos = Object.values(TipoFiltroEstado);
            if (estadosValidos.includes(estado as TipoFiltroEstado)) {
                filtros.estado = estado as TipoFiltroEstado;
            } else {
                // Si el estado no es válido, lanzamos un error específico explicando las opciones
                throw new Error(`Estado '${estado}' no válido. Estados permitidos: ${estadosValidos.join(', ')}`);
            }
        }
        // Si no se especifica estado, el caso de uso usará 'activos' por defecto

        if (nombre) {
            filtros.nombre = nombre;
        }

        // Validamos y convertimos los parámetros numéricos con límites razonables
        if (limite) {
            const limiteNum = parseInt(limite, 10);
            if (!isNaN(limiteNum) && limiteNum > 0 && limiteNum <= 100) {
                filtros.limite = limiteNum;
            } else {
                throw new Error('El límite debe ser un número entre 1 y 100');
            }
        }

        if (offset) {
            const offsetNum = parseInt(offset, 10);
            if (!isNaN(offsetNum) && offsetNum >= 0) {
                filtros.offset = offsetNum;
            } else {
                throw new Error('El offset debe ser un número mayor o igual a 0');
            }
        }

        return await this.listarRolesCasoUso.ejecutar(filtros);
    }

    @Get(':id')
    async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return await this.obtenerRolCasoUso.ejecutar(id);
    }

    @Put(':id')
    async actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarRolDto: ActualizarRolDto,
    ) {
        const idUsuarioEjecutor = 1;
        return await this.actualizarRolCasoUso.ejecutar(id, actualizarRolDto, idUsuarioEjecutor);
    }

    @Delete(':id')
    // Removemos el @HttpCode(HttpStatus.NO_CONTENT) para usar el 200 por defecto
    async eliminar(@Param('id', ParseIntPipe) id: number) {
        const idUsuarioEjecutor = 1;

        // Ahora devolvemos la respuesta estructurada en lugar de void
        return await this.eliminarRolCasoUso.ejecutar(id, idUsuarioEjecutor);
    }

    /**
     * PATCH /roles/:id/restaurar
     * Restaura un rol eliminado (soft delete) volviéndolo al estado activo.
     * 
     * Usamos PATCH porque estamos modificando parcialmente el estado del recurso.
     * Usamos una ruta específica (/restaurar) para que sea clara la intención.
     * 
     * Ejemplo: PATCH /roles/5/restaurar
     */
    @Patch(':id/restaurar')
    async restaurar(@Param('id', ParseIntPipe) id: number) {
        const idUsuarioEjecutor = 1;
        return await this.restaurarRolCasoUso.ejecutar(id, idUsuarioEjecutor);
    }
}