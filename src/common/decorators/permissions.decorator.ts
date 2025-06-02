import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator para especificar qué permisos específicos se requieren
 * 
 * @param permissions - Lista de códigos de permisos requeridos
 * 
 * Ejemplos:
 * @Permissions('usuarios.crear') - Permiso específico para crear usuarios
 * @Permissions('roles.editar', 'permisos.ver') - Múltiples permisos (requiere TODOS)
 * @Permissions('reportes.generar') - Permiso específico para reportes
 */
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);