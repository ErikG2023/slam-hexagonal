import { IsNotEmpty, IsString, IsOptional, Length, Matches } from 'class-validator';

export class LoginRequestDto {
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

    // OPCIONALES - Si el frontend los envía, genial. Si no, auto-detectamos.
    @IsOptional()
    @IsString({ message: 'El ID del dispositivo debe ser una cadena de texto' })
    @Length(1, 255, { message: 'El ID del dispositivo no puede exceder 255 caracteres' })
    deviceId?: string;

    @IsOptional()
    @IsString({ message: 'El nombre del dispositivo debe ser una cadena de texto' })
    @Length(1, 100, { message: 'El nombre del dispositivo no puede exceder 100 caracteres' })
    deviceName?: string;
}