import { IsOptional, IsNumber, IsBoolean, IsInt, Min } from 'class-validator';

export class ActualizarUsuarioDto {
    @IsOptional()
    @IsNumber({}, { message: 'El ID del rol debe ser un número' })
    @IsInt({ message: 'El ID del rol debe ser un número entero' })
    @Min(1, { message: 'El ID del rol debe ser mayor a 0' })
    idRol?: number;

    @IsOptional()
    @IsBoolean({ message: 'El estado de bloqueo debe ser verdadero o falso' })
    bloqueado?: boolean;
}