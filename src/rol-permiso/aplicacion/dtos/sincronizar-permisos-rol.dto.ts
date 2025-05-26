import { IsNotEmpty, IsArray, IsNumber, ArrayMinSize, ArrayUnique } from 'class-validator';

export class SincronizarPermisosRolDto {
    @IsNotEmpty({ message: 'La lista de permisos es requerida' })
    @IsArray({ message: 'Los permisos deben ser un array' })
    @IsNumber({}, { each: true, message: 'Cada permiso debe ser un número válido' })
    @ArrayUnique({ message: 'No se permiten permisos duplicados' })
    idsPermisosAsignados: number[];
}