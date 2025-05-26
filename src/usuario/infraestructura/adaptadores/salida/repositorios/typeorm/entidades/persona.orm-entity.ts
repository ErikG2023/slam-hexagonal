import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('persona')
export class PersonaOrmEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'nombres', type: 'varchar', length: 100, nullable: false })
    nombres: string;

    @Column({ name: 'apellido_paterno', type: 'varchar', length: 50, nullable: false })
    apellidoPaterno: string;

    @Column({ name: 'apellido_materno', type: 'varchar', length: 50, nullable: false })
    apellidoMaterno: string;

    @Column({ name: 'rut', type: 'varchar', length: 12, nullable: false })
    rut: string;

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
    fechaNacimiento: Date | null;

    @Column({ name: 'id_nacionalidad', type: 'int', nullable: true })
    idNacionalidad: number | null;

    @Column({ name: 'id_estado_civil', type: 'int', nullable: true })
    idEstadoCivil: number | null;

    @Column({ name: 'id_genero', type: 'int', nullable: true })
    idGenero: number | null;

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
}