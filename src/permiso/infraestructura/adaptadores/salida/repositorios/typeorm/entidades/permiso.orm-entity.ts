import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('permiso')
export class PermisoOrmEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'nombre', type: 'varchar', length: 50, nullable: false })
    nombre: string;

    @Column({ name: 'descripcion', type: 'varchar', length: 200, nullable: true })
    descripcion: string | null;

    @Column({ name: 'codigo', type: 'varchar', length: 50, nullable: false })
    codigo: string;

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