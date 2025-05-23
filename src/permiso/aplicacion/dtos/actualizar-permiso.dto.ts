import { IsNotEmpty, IsString, IsOptional, Length, Matches } from 'class-validator';

export class ActualizarPermisoDto {
    @IsOptional()
    @IsNotEmpty({ message: 'El nombre del permiso no puede estar vacío' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_]+$/, {
        message: 'El nombre solo puede contener letras, espacios, guiones y guiones bajos'
    })
    nombre?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'El código del permiso no puede estar vacío' })
    @IsString({ message: 'El código debe ser una cadena de texto' })
    @Length(2, 50, { message: 'El código debe tener entre 2 y 50 caracteres' })
    @Matches(/^[a-zA-Z0-9\-_.]+$/, {
        message: 'El código solo puede contener letras, números, guiones, puntos y guiones bajos'
    })
    codigo?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @Length(0, 200, { message: 'La descripción no puede exceder 200 caracteres' })
    descripcion?: string;
}