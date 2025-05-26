import { IsNotEmpty, IsString, IsNumber, IsOptional, Length, Matches, IsInt, Min } from 'class-validator';

export class CrearUsuarioDto {
    @IsNotEmpty({ message: 'El ID de la persona es requerido' })
    @IsNumber({}, { message: 'El ID de la persona debe ser un número' })
    @IsInt({ message: 'El ID de la persona debe ser un número entero' })
    @Min(1, { message: 'El ID de la persona debe ser mayor a 0' })
    idPersona: number;

    @IsNotEmpty({ message: 'El ID del rol es requerido' })
    @IsNumber({}, { message: 'El ID del rol debe ser un número' })
    @IsInt({ message: 'El ID del rol debe ser un número entero' })
    @Min(1, { message: 'El ID del rol debe ser mayor a 0' })
    idRol: number;

    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @Length(3, 50, { message: 'El nombre de usuario debe tener entre 3 y 50 caracteres' })
    @Matches(/^[a-zA-Z0-9._-]+$/, {
        message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos'
    })
    username: string;

    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @Length(6, 100, { message: 'La contraseña debe tener entre 6 y 100 caracteres' })
    password: string;
}