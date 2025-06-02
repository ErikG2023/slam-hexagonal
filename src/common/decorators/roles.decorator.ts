import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar qué roles pueden acceder a un endpoint
 * 
 * @param roles - Lista de roles permitidos
 * 
 * Ejemplos:
 * @Roles('admin') - Solo administradores
 * @Roles('admin', 'supervisor') - Administradores o supervisores
 * @Roles('usuario') - Solo usuarios regulares
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);