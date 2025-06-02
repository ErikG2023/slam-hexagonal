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
import { CrearPermisoCasoUso } from '../../../../aplicacion/casos-uso/crear-permiso.caso-uso';
import { ActualizarPermisoCasoUso } from '../../../../aplicacion/casos-uso/actualizar-permiso.caso-uso';
import { ObtenerPermisoCasoUso } from '../../../../aplicacion/casos-uso/obtener-permiso.caso-uso';
import { ListarPermisosCasoUso, FiltrosListarPermisos, TipoFiltroEstado } from '../../../../aplicacion/casos-uso/listar-permisos.caso-uso';
import { EliminarPermisoCasoUso } from '../../../../aplicacion/casos-uso/eliminar-permiso.caso-uso';
import { RestaurarPermisoCasoUso } from '../../../../aplicacion/casos-uso/restaurar-permiso.caso-uso';
import { CrearPermisoDto } from '../../../../aplicacion/dtos/crear-permiso.dto';
import { ActualizarPermisoDto } from '../../../../aplicacion/dtos/actualizar-permiso.dto';
import { AuditUser } from 'src/common/decorators/audit-user.decorator';

@Controller('permisos')
export class PermisoController {
    constructor(
        private readonly crearPermisoCasoUso: CrearPermisoCasoUso,
        private readonly actualizarPermisoCasoUso: ActualizarPermisoCasoUso,
        private readonly obtenerPermisoCasoUso: ObtenerPermisoCasoUso,
        private readonly listarPermisosCasoUso: ListarPermisosCasoUso,
        private readonly eliminarPermisoCasoUso: EliminarPermisoCasoUso,
        private readonly restaurarPermisoCasoUso: RestaurarPermisoCasoUso,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async crear(
        @Body() crearPermisoDto: CrearPermisoDto,
        @AuditUser() userId: number // ✅ Usuario real del token
    ) {
        return await this.crearPermisoCasoUso.ejecutar(crearPermisoDto, userId);
    }

    /**
     * GET /permisos
     * Lista permisos con filtros mejorados y paginación.
     * 
     * Ejemplos de uso:
     * - GET /permisos (solo permisos activos, comportamiento por defecto)
     * - GET /permisos?estado=activos (explícitamente solo activos)
     * - GET /permisos?estado=eliminados (solo permisos eliminados/inactivos)
     * - GET /permisos?estado=todos (todos los permisos sin importar estado)
     * - GET /permisos?estado=activos&nombre=usuario (buscar "usuario" en nombre solo en activos)
     * - GET /permisos?estado=activos&codigo=crear (buscar "crear" en código solo en activos)
     * - GET /permisos?limite=5&offset=10&estado=todos (paginación con todos los estados)
     */
    @Get()
    async listar(
        @Query('estado') estado?: string,
        @Query('nombre') nombre?: string,
        @Query('codigo') codigo?: string,
        @Query('limite') limite?: string,
        @Query('offset') offset?: string,
    ) {
        const filtros: FiltrosListarPermisos = {};

        // Validamos y convertimos el parámetro de estado
        if (estado) {
            const estadosValidos = Object.values(TipoFiltroEstado);
            if (estadosValidos.includes(estado as TipoFiltroEstado)) {
                filtros.estado = estado as TipoFiltroEstado;
            } else {
                throw new Error(`Estado '${estado}' no válido. Estados permitidos: ${estadosValidos.join(', ')}`);
            }
        }

        if (nombre) {
            filtros.nombre = nombre;
        }

        if (codigo) {
            filtros.codigo = codigo;
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

        return await this.listarPermisosCasoUso.ejecutar(filtros);
    }

    @Get(':id')
    async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return await this.obtenerPermisoCasoUso.ejecutar(id);
    }

    @Put(':id')
    async actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarPermisoDto: ActualizarPermisoDto,
        @AuditUser() userId: number 
    ) {
        return await this.actualizarPermisoCasoUso.ejecutar(id, actualizarPermisoDto, userId);
    }

    @Delete(':id')
    async eliminar(
        @Param('id', ParseIntPipe) id: number,
        @AuditUser() userId: number 
    ) {
        return await this.eliminarPermisoCasoUso.ejecutar(id, userId);
    }

    /**
     * PATCH /permisos/:id/restaurar
     * Restaura un permiso eliminado (soft delete) volviéndolo al estado activo.
     * 
     * Ejemplo: PATCH /permisos/5/restaurar
     */
    @Patch(':id/restaurar')
    async restaurar(
        @Param('id', ParseIntPipe) id: number,
        @AuditUser() userId: number 
    ) {
        return await this.restaurarPermisoCasoUso.ejecutar(id, userId);
    }
}