import { RolOrmEntity } from 'src/rol/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('usuario')
export class UsuarioOrmEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'id_persona', type: 'int', nullable: false })
    idPersona: number;

    @Column({ name: 'id_rol', type: 'int', nullable: false })
    idRol: number;

    @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
    username: string;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ name: 'bloqueado', type: 'boolean', default: false })
    bloqueado: boolean;

    @Column({ name: 'ultimo_acceso', type: 'timestamp', nullable: true })
    ultimoAcceso: Date | null;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
    fechaCreacion: Date;

    @Column({ name: 'id_usuario_creacion', type: 'int', nullable: true })
    idUsuarioCreacion: number | null;

    @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', nullable: true })
    fechaModificacion: Date | null;

    @Column({ name: 'id_usuario_modificacion', type: 'int', nullable: true })
    idUsuarioModificacion: number | null;

    @Column({ name: 'activo', type: 'boolean', default: true })
    activo: boolean;

    // Relación con rol (opcional, útil para consultas)
    @ManyToOne(() => RolOrmEntity)
    @JoinColumn({ name: 'id_rol' })
    rol?: RolOrmEntity;
}