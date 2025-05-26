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
import { CrearUsuarioCasoUso } from '../../../../aplicacion/casos-uso/crear-usuario.caso-uso';
import { ActualizarUsuarioCasoUso } from '../../../../aplicacion/casos-uso/actualizar-usuario.caso-uso';
import { CambiarPasswordCasoUso } from '../../../../aplicacion/casos-uso/cambiar-password.caso-uso';
import { ObtenerUsuarioCasoUso } from '../../../../aplicacion/casos-uso/obtener-usuario.caso-uso';
import { ListarUsuariosCasoUso, FiltrosListarUsuarios, TipoFiltroEstado, TipoFiltroBloqueado } from '../../../../aplicacion/casos-uso/listar-usuarios.caso-uso';
import { EliminarUsuarioCasoUso } from '../../../../aplicacion/casos-uso/eliminar-usuario.caso-uso';
import { RestaurarUsuarioCasoUso } from '../../../../aplicacion/casos-uso/restaurar-usuario.caso-uso';
import { BloquearUsuarioCasoUso } from '../../../../aplicacion/casos-uso/bloquear-usuario.caso-uso';
import { DesbloquearUsuarioCasoUso } from '../../../../aplicacion/casos-uso/desbloquear-usuario.caso-uso';
import { CrearUsuarioDto } from '../../../../aplicacion/dtos/crear-usuario.dto';
import { ActualizarUsuarioDto } from '../../../../aplicacion/dtos/actualizar-usuario.dto';
import { CambiarPasswordDto } from '../../../../aplicacion/dtos/cambiar-password.dto';

@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly crearUsuarioCasoUso: CrearUsuarioCasoUso,
        private readonly actualizarUsuarioCasoUso: ActualizarUsuarioCasoUso,
        private readonly cambiarPasswordCasoUso: CambiarPasswordCasoUso,
        private readonly obtenerUsuarioCasoUso: ObtenerUsuarioCasoUso,
        private readonly listarUsuariosCasoUso: ListarUsuariosCasoUso,
        private readonly eliminarUsuarioCasoUso: EliminarUsuarioCasoUso,
        private readonly restaurarUsuarioCasoUso: RestaurarUsuarioCasoUso,
        private readonly bloquearUsuarioCasoUso: BloquearUsuarioCasoUso,
        private readonly desbloquearUsuarioCasoUso: DesbloquearUsuarioCasoUso,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() crearUsuarioDto: CrearUsuarioDto) {
        const idUsuarioEjecutor = 1; // TODO: Obtener del contexto de autenticación
        return await this.crearUsuarioCasoUso.ejecutar(crearUsuarioDto, idUsuarioEjecutor);
    }

    /**
     * GET /usuarios
     * Lista usuarios con filtros avanzados y paginación.
     * 
     * Ejemplos de uso:
     * - GET /usuarios (solo usuarios activos, comportamiento por defecto)
     * - GET /usuarios?estado=activos (explícitamente solo activos)
     * - GET /usuarios?estado=eliminados (solo usuarios eliminados/inactivos)
     * - GET /usuarios?estado=todos (todos los usuarios sin importar estado)
     * - GET /usuarios?bloqueado=bloqueados (solo usuarios bloqueados)
     * - GET /usuarios?bloqueado=no_bloqueados (solo usuarios no bloqueados)
     * - GET /usuarios?estado=activos&bloqueado=no_bloqueados&idRol=1 (usuarios activos, no bloqueados, con rol específico)
     * - GET /usuarios?username=admin (buscar "admin" en username)
     * - GET /usuarios?limite=5&offset=10 (paginación)
     */
    @Get()
    async listar(
        @Query('estado') estado?: string,
        @Query('bloqueado') bloqueado?: string,
        @Query('idRol') idRol?: string,
        @Query('username') username?: string,
        @Query('limite') limite?: string,
        @Query('offset') offset?: string,
    ) {
        const filtros: FiltrosListarUsuarios = {};

        // Validar y convertir el parámetro de estado
        if (estado) {
            const estadosValidos = Object.values(TipoFiltroEstado);
            if (estadosValidos.includes(estado as TipoFiltroEstado)) {
                filtros.estado = estado as TipoFiltroEstado;
            } else {
                throw new Error(`Estado '${estado}' no válido. Estados permitidos: ${estadosValidos.join(', ')}`);
            }
        }

        // Validar y convertir el parámetro de bloqueado
        if (bloqueado) {
            const bloqueadosValidos = Object.values(TipoFiltroBloqueado);
            if (bloqueadosValidos.includes(bloqueado as TipoFiltroBloqueado)) {
                filtros.bloqueado = bloqueado as TipoFiltroBloqueado;
            } else {
                throw new Error(`Filtro bloqueado '${bloqueado}' no válido. Valores permitidos: ${bloqueadosValidos.join(', ')}`);
            }
        }

        if (username) {
            filtros.username = username;
        }

        // Validar y convertir idRol
        if (idRol) {
            const idRolNum = parseInt(idRol, 10);
            if (!isNaN(idRolNum) && idRolNum > 0) {
                filtros.idRol = idRolNum;
            } else {
                throw new Error('El ID del rol debe ser un número mayor a 0');
            }
        }

        // Validar y convertir los parámetros numéricos de paginación
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

        return await this.listarUsuariosCasoUso.ejecutar(filtros);
    }

    @Get(':id')
    async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return await this.obtenerUsuarioCasoUso.ejecutar(id);
    }

    @Put(':id')
    async actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
    ) {
        const idUsuarioEjecutor = 1; // TODO: Obtener del contexto de autenticación
        return await this.actualizarUsuarioCasoUso.ejecutar(id, actualizarUsuarioDto, idUsuarioEjecutor);
    }

    /**
     * PATCH /usuarios/:id/password
     * Cambia la contraseña de un usuario específico.
     * 
     * Ejemplo: PATCH /usuarios/5/password
     * Body: { "nuevaPassword": "nuevaContraseña123" }
     */
    @Patch(':id/password')
    async cambiarPassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() cambiarPasswordDto: CambiarPasswordDto,
    ) {
        const idUsuarioEjecutor = 1; // TODO: Obtener del contexto de autenticación
        return await this.cambiarPasswordCasoUso.ejecutar(id, cambiarPasswordDto, idUsuarioEjecutor);
    }

    /**
     * PATCH /usuarios/:id/bloquear
     * Bloquea un usuario específico.
     * 
     * Ejemplo: PATCH /usuarios/5/bloquear
     */
    @Patch(':id/bloquear')
    async bloquear(@Param('id', ParseIntPipe) id: number) {
        const idUsuarioEjecutor = 1; // TODO: Obtener del contexto de autenticación
        return await this.bloquearUsuarioCasoUso.ejecutar(id, idUsuarioEjecutor);
    }

    /**
     * PATCH /usuarios/:id/desbloquear
     * Desbloquea un usuario específico.
     * 
     * Ejemplo: PATCH /usuarios/5/desbloquear
     */
    @Patch(':id/desbloquear')
    async desbloquear(@Param('id', ParseIntPipe) id: number) {
        const idUsuarioEjecutor = 1; // TODO: Obtener del contexto de autenticación
        return await this.desbloquearUsuarioCasoUso.ejecutar(id, idUsuarioEjecutor);
    }

    @Delete(':id')
    async eliminar(@Param('id', ParseIntPipe) id: number) {
        const idUsuarioEjecutor = 1; // TODO: Obtener del contexto de autenticación
        return await this.eliminarUsuarioCasoUso.ejecutar(id, idUsuarioEjecutor);
    }

    /**
     * PATCH /usuarios/:id/restaurar
     * Restaura un usuario eliminado (soft delete) volviéndolo al estado activo.
     * 
     * Ejemplo: PATCH /usuarios/5/restaurar
     */
    @Patch(':id/restaurar')
    async restaurar(@Param('id', ParseIntPipe) id: number) {
        const idUsuarioEjecutor = 1; // TODO: Obtener del contexto de autenticación
        return await this.restaurarUsuarioCasoUso.ejecutar(id, idUsuarioEjecutor);
    }
}