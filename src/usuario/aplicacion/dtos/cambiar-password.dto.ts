import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CambiarPasswordDto {
    @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
    @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
    @Length(6, 100, { message: 'La nueva contraseña debe tener entre 6 y 100 caracteres' })
    nuevaPassword: string;
}