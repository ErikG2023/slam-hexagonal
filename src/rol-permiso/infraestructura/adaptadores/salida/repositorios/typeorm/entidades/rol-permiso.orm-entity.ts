import { PermisoOrmEntity } from 'src/permiso/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/permiso.orm-entity';
import { RolOrmEntity } from 'src/rol/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/rol.orm-entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rol_permiso')
export class RolPermisoOrmEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'id_rol', type: 'int', nullable: false })
    idRol: number;

    @Column({ name: 'id_permiso', type: 'int', nullable: false })
    idPermiso: number;

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

    // Relaciones para joins (opcional, útil para consultas complejas)
    @ManyToOne(() => RolOrmEntity)
    @JoinColumn({ name: 'id_rol' })
    rol?: RolOrmEntity;

    @ManyToOne(() => PermisoOrmEntity)
    @JoinColumn({ name: 'id_permiso' })
    permiso?: PermisoOrmEntity;
}