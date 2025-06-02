import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioOrmEntity } from '../../../../../../../usuario/infraestructura/adaptadores/salida/repositorios/typeorm/entidades/usuario.orm-entity';

@Entity('sesion')
export class SesionOrmEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number; // Mantenemos como serial, no UUID

    @Column({ name: 'id_usuario', type: 'int', nullable: false })
    idUsuario: number;

    @Column({ name: 'token', type: 'text', nullable: false })
    token: string; // Aquí guardaremos el hash del token

    @Column({ name: 'refresh_token', type: 'text', nullable: true })
    refreshToken: string | null;

    @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
    ipAddress: string | null;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string | null;

    @CreateDateColumn({ name: 'fecha_inicio', type: 'timestamp' })
    fechaInicio: Date;

    @Column({ name: 'fecha_expiracion', type: 'timestamp', nullable: false })
    fechaExpiracion: Date;

    @Column({ name: 'activa', type: 'boolean', default: true })
    activa: boolean;

    @Column({ name: 'device_id', type: 'varchar', length: 255, nullable: true })
    deviceId: string | null;

    @Column({ name: 'device_name', type: 'varchar', length: 100, nullable: true })
    deviceName: string | null;

    // Campos WebSocket - Reutilizamos para nuestros propósitos
    @Column({ name: 'websocket_id', type: 'varchar', length: 255, nullable: true })
    websocketId: string | null;

    @Column({ name: 'websocket_connected', type: 'boolean', default: false })
    websocketConnected: boolean | null;

    @Column({ name: 'last_websocket_activity', type: 'timestamp', nullable: true })
    lastWebsocketActivity: Date | null; // Lo usaremos como ultima_actividad

    @Column({ name: 'client_info', type: 'jsonb', nullable: true })
    clientInfo: any;

    // Campos de auditoría
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

    // Relación con usuario
    @ManyToOne(() => UsuarioOrmEntity)
    @JoinColumn({ name: 'id_usuario' })
    usuario?: UsuarioOrmEntity;
}