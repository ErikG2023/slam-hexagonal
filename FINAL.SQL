-- ========================================================
-- CONFIGURACIÓN INICIAL DE LA BASE DE DATOS INTEGRADA
-- ========================================================

-- Recrear esquema público
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION pg_database_owner;
COMMENT ON SCHEMA public IS 'Esquema principal del sistema integrado de autenticación y gestión de mantenimiento';

-- ========================================================
-- SECUENCIAS
-- ========================================================

-- Secuencias del sistema de autenticación
CREATE SEQUENCE public.ciudad_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.direccion_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.intento_login_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.permiso_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.persona_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.region_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.rol_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.rol_permiso_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.sesion_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.telefono_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.token_recuperacion_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.usuario_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.nacionalidad_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.estado_civil_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.genero_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.tipo_afp_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.tipo_sistema_salud_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.persona_afp_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.persona_sistema_salud_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Secuencias adicionales del sistema de gestión de mantenimiento
CREATE SEQUENCE public.faena_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.cargo_base_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.persona_cargo_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.requisito_cargo_especifico_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.cargo_especifico_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.tipo_requisito_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.requisito_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.requisito_faena_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.proceso_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.estado_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.tipo_contacto_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.contacto_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.mantencion_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.requerimiento_dotacion_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.nomina_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.nomina_trabajador_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.hist_proceso_trabajador_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.cumplimiento_requisito_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.contrato_trabajador_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.estado_trabajador_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.trabajador_estado_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
CREATE SEQUENCE public.registro_falta_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- ========================================================
-- TABLA BASE DE AUDITORÍA
-- ========================================================

CREATE TABLE public.auditoria (
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creacion int4 NULL,
    fecha_modificacion timestamp NULL,
    id_usuario_modificacion int4 NULL,
    activo bool NULL DEFAULT true
);

-- ========================================================
-- CREACIÓN DE TABLAS (Orden respetando dependencias)
-- ========================================================

-- 1. Permiso (Sin dependencias)
CREATE TABLE public.permiso (
    id serial4 NOT NULL,
    nombre varchar(50) NOT NULL,
    descripcion varchar(200) NULL,
    codigo varchar(50) NOT NULL,
    CONSTRAINT permiso_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 2. Rol (Sin dependencias)
CREATE TABLE public.rol (
    id serial4 NOT NULL,
    nombre varchar(50) NOT NULL,
    descripcion varchar(200) NULL,
    CONSTRAINT rol_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 3. Rol_Permiso (Depende de Rol y Permiso)
CREATE TABLE public.rol_permiso (
    id serial4 NOT NULL,
    id_rol int4 NOT NULL,
    id_permiso int4 NOT NULL,
    CONSTRAINT rol_permiso_pkey PRIMARY KEY (id),
    CONSTRAINT rol_permiso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permiso(id),
    CONSTRAINT rol_permiso_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id)
) INHERITS (public.auditoria);

-- 4. Region (Sin dependencias)
CREATE TABLE public.region (
    id serial4 NOT NULL,
    nombre varchar(100) NOT NULL,
    numero_region varchar(10) NOT NULL,
    codigo varchar(5) NOT NULL,
    CONSTRAINT region_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 5. Ciudad (Depende de Region)
CREATE TABLE public.ciudad (
    id serial4 NOT NULL,
    id_region int4 NOT NULL,
    nombre varchar(100) NOT NULL,
    CONSTRAINT ciudad_pkey PRIMARY KEY (id),
    CONSTRAINT ciudad_id_region_fkey FOREIGN KEY (id_region) REFERENCES public.region(id)
) INHERITS (public.auditoria);

-- 6. Nacionalidad (Sin dependencias)
CREATE TABLE public.nacionalidad (
    id serial4 NOT NULL,
    nombre varchar(100) NOT NULL,
    codigo varchar(5) NOT NULL,
    CONSTRAINT nacionalidad_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 7. Estado Civil (Sin dependencias)
CREATE TABLE public.estado_civil (
    id serial4 NOT NULL,
    nombre varchar(50) NOT NULL,
    CONSTRAINT estado_civil_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 8. Genero (Sin dependencias)
CREATE TABLE public.genero (
    id serial4 NOT NULL,
    nombre varchar(50) NOT NULL,
    CONSTRAINT genero_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 9. Tipo AFP (Sin dependencias)
CREATE TABLE public.tipo_afp (
    id serial4 NOT NULL,
    nombre varchar(100) NOT NULL,
    codigo varchar(10) NOT NULL,
    CONSTRAINT tipo_afp_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 10. Tipo Sistema de Salud (Sin dependencias)
CREATE TABLE public.tipo_sistema_salud (
    id serial4 NOT NULL,
    tipo varchar(10) NOT NULL,
    nombre varchar(100) NOT NULL,
    codigo varchar(10) NOT NULL,
    CONSTRAINT tipo_sistema_salud_pkey PRIMARY KEY (id),
    CONSTRAINT tipo_sistema_salud_tipo_check CHECK (tipo IN ('FONASA', 'ISAPRE'))
) INHERITS (public.auditoria);

-- 11. Persona (Depende de varias tablas)
CREATE TABLE public.persona (
    id serial4 NOT NULL,
    nombres varchar(100) NOT NULL,
    apellido_paterno varchar(50) NOT NULL,
    apellido_materno varchar(50) NOT NULL,
    rut varchar(12) NOT NULL,
    email varchar(255) NOT NULL,
    fecha_nacimiento date NULL,
    id_nacionalidad int4 NULL,
    id_estado_civil int4 NULL,
    id_genero int4 NULL,
    CONSTRAINT persona_pkey PRIMARY KEY (id),
    CONSTRAINT persona_id_nacionalidad_fkey FOREIGN KEY (id_nacionalidad) REFERENCES public.nacionalidad(id),
    CONSTRAINT persona_id_estado_civil_fkey FOREIGN KEY (id_estado_civil) REFERENCES public.estado_civil(id),
    CONSTRAINT persona_id_genero_fkey FOREIGN KEY (id_genero) REFERENCES public.genero(id)
) INHERITS (public.auditoria);

-- 12. Direccion (Depende de Ciudad y Persona)
CREATE TABLE public.direccion (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_ciudad int4 NOT NULL,
    tipo varchar(20) NOT NULL DEFAULT 'PARTICULAR',
    calle varchar(200) NOT NULL,
    numero varchar(20) NOT NULL,
    depto varchar(20) NULL,
    villa_poblacion varchar(200) NULL,
    codigo_postal varchar(20) NULL,
    principal boolean NOT NULL DEFAULT false,
    CONSTRAINT direccion_pkey PRIMARY KEY (id),
    CONSTRAINT direccion_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudad(id),
    CONSTRAINT direccion_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT direccion_tipo_check CHECK (tipo IN ('PARTICULAR', 'LABORAL', 'CORRESPONDENCIA', 'OTRO'))
) INHERITS (public.auditoria);

-- 13. Persona_AFP (Depende de Persona y Tipo_AFP)
CREATE TABLE public.persona_afp (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_tipo_afp int4 NOT NULL,
    porcentaje_descuento decimal(5,2) NOT NULL DEFAULT 10.77,
    fecha_inicio date NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin date NULL,
    CONSTRAINT persona_afp_pkey PRIMARY KEY (id),
    CONSTRAINT persona_afp_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT persona_afp_id_tipo_afp_fkey FOREIGN KEY (id_tipo_afp) REFERENCES public.tipo_afp(id)
) INHERITS (public.auditoria);

-- 14. Persona_Sistema_Salud (Depende de Persona y Tipo_Sistema_Salud)
CREATE TABLE public.persona_sistema_salud (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_tipo_sistema_salud int4 NOT NULL,
    porcentaje_descuento decimal(5,2) NOT NULL DEFAULT 7.00,
    fecha_inicio date NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin date NULL,
    CONSTRAINT persona_sistema_salud_pkey PRIMARY KEY (id),
    CONSTRAINT persona_sistema_salud_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT persona_sistema_salud_id_tipo_sistema_salud_fkey FOREIGN KEY (id_tipo_sistema_salud) REFERENCES public.tipo_sistema_salud(id)
) INHERITS (public.auditoria);

-- 15. Telefono (Depende de Persona)
CREATE TABLE public.telefono (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    numero varchar(20) NOT NULL,
    tipo varchar(20) NOT NULL,
    descripcion varchar(200) NULL,
    principal bool NULL DEFAULT false,
    CONSTRAINT telefono_pkey PRIMARY KEY (id),
    CONSTRAINT telefono_tipo_check CHECK (tipo IN ('PERSONAL', 'EMERGENCIA', 'TRABAJO')),
    CONSTRAINT telefono_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id)
) INHERITS (public.auditoria);

-- 16. Usuario (Depende de Persona y Rol)
CREATE TABLE public.usuario (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_rol int4 NOT NULL,
    username varchar(50) NOT NULL,
    password varchar(255) NOT NULL,
    bloqueado bool NULL DEFAULT false,
    ultimo_acceso timestamp NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (id),
    CONSTRAINT usuario_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id)
) INHERITS (public.auditoria);

-- 17. Intento_Login (Depende de Usuario)
CREATE TABLE public.intento_login (
    id serial4 NOT NULL,
    id_usuario int4 NULL,
    ip_address varchar(45) NOT NULL,
    exitoso bool NOT NULL,
    fecha_intento timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo_fallo varchar(100) NULL,
    user_agent text NULL,
    intentos_consecutivos int4 NULL DEFAULT 0,
    CONSTRAINT intento_login_pkey PRIMARY KEY (id),
    CONSTRAINT intento_login_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id)
) INHERITS (public.auditoria);

-- 18. Sesion (Depende de Usuario)
CREATE TABLE public.sesion (
    id serial4 NOT NULL,
    id_usuario int4 NOT NULL,
    token text NOT NULL,
    refresh_token text NULL,
    ip_address varchar(45) NULL,
    user_agent text NULL,
    fecha_inicio timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion timestamp NOT NULL,
    activa bool NULL DEFAULT true,
    device_id varchar(255) NULL,
    device_name varchar(100) NULL,
    -- Campos para WebSockets
    websocket_id varchar(255) NULL,
    websocket_connected bool NULL DEFAULT false,
    last_websocket_activity timestamp NULL,
    client_info jsonb NULL,
    CONSTRAINT sesion_pkey PRIMARY KEY (id),
    CONSTRAINT sesion_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id)
) INHERITS (public.auditoria);

-- 19. Token_Recuperacion (Depende de Usuario)
CREATE TABLE public.token_recuperacion (
    id serial4 NOT NULL,
    id_usuario int4 NOT NULL,
    token varchar(255) NOT NULL,
    fecha_expiracion timestamp NOT NULL,
    usado bool NULL DEFAULT false,
    ip_solicitante varchar(45) NULL,
    fecha_uso timestamp NULL,
    email_enviado varchar(255) NULL,
    CONSTRAINT token_recuperacion_pkey PRIMARY KEY (id),
    CONSTRAINT token_recuperacion_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id)
) INHERITS (public.auditoria);

-- ========================================================
-- TABLAS DEL SISTEMA DE GESTIÓN DE MANTENIMIENTO
-- ========================================================

-- 20. Faena (Sin dependencias)
CREATE TABLE public.faena (
    id serial4 NOT NULL,
    codigo varchar(10) NOT NULL,
    nombre varchar(100) NOT NULL,
    ubicacion varchar(200) NOT NULL,
    tipo varchar(50) NOT NULL,
    CONSTRAINT faena_pkey PRIMARY KEY (id),
    CONSTRAINT faena_codigo_unique UNIQUE (codigo)
) INHERITS (public.auditoria);

-- 21. Cargo Base (Sin dependencias)
CREATE TABLE public.cargo_base (
    id serial4 NOT NULL,
    nombre varchar(100) NOT NULL,
    CONSTRAINT cargo_base_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 22. Cargo Específico (Depende de Cargo Base y Faena)
CREATE TABLE public.cargo_especifico (
    id serial4 NOT NULL,
    id_cargo_base int4 NOT NULL,
    id_faena int4 NOT NULL,
    nombre varchar(100) NOT NULL,
    valor_diario numeric(10,2) NOT NULL,
    CONSTRAINT cargo_especifico_pkey PRIMARY KEY (id),
    CONSTRAINT cargo_especifico_id_cargo_base_fkey FOREIGN KEY (id_cargo_base) REFERENCES public.cargo_base(id),
    CONSTRAINT cargo_especifico_id_faena_fkey FOREIGN KEY (id_faena) REFERENCES public.faena(id)
) INHERITS (public.auditoria);

-- 23. Persona Cargo (Depende de Persona y Cargo Base)
CREATE TABLE public.persona_cargo (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_cargo_base int4 NOT NULL,
    es_principal bool NOT NULL DEFAULT false,
    experiencia_anos int NULL,
    nivel varchar(50) NULL,
    observaciones varchar(200) NULL,
    CONSTRAINT persona_cargo_pkey PRIMARY KEY (id),
    CONSTRAINT persona_cargo_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT persona_cargo_id_cargo_base_fkey FOREIGN KEY (id_cargo_base) REFERENCES public.cargo_base(id),
    CONSTRAINT persona_cargo_nivel_check CHECK (nivel IN ('JUNIOR', 'INTERMEDIO', 'SENIOR', 'EXPERTO'))
) INHERITS (public.auditoria);

-- 24. Tipo Requisito (Sin dependencias)
CREATE TABLE public.tipo_requisito (
    id serial4 NOT NULL,
    nombre varchar(100) NOT NULL,
    detalle varchar(200) NULL,
    CONSTRAINT tipo_requisito_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 25. Requisito (Depende de Tipo Requisito)
CREATE TABLE public.requisito (
    id serial4 NOT NULL,
    id_tipo_requisito int4 NOT NULL,
    nombre varchar(100) NOT NULL,
    detalle varchar(200) NULL,
    CONSTRAINT requisito_pkey PRIMARY KEY (id),
    CONSTRAINT requisito_id_tipo_requisito_fkey FOREIGN KEY (id_tipo_requisito) REFERENCES public.tipo_requisito(id)
) INHERITS (public.auditoria);

-- 26. Requisito por Faena (Depende de Requisito y Faena)
CREATE TABLE public.requisito_faena (
    id serial4 NOT NULL,
    id_requisito int4 NOT NULL,
    id_faena int4 NOT NULL,
    obligatorio bool NOT NULL DEFAULT true,
    CONSTRAINT requisito_faena_pkey PRIMARY KEY (id),
    CONSTRAINT requisito_faena_id_requisito_fkey FOREIGN KEY (id_requisito) REFERENCES public.requisito(id),
    CONSTRAINT requisito_faena_id_faena_fkey FOREIGN KEY (id_faena) REFERENCES public.faena(id)
) INHERITS (public.auditoria);

-- 27. Requisito por Cargo Específico (Depende de Requisito y Cargo Específico)
CREATE TABLE public.requisito_cargo_especifico (
    id serial4 NOT NULL,
    id_requisito int4 NOT NULL,
    id_cargo_especifico int4 NOT NULL,
    obligatorio bool NOT NULL DEFAULT true,
    CONSTRAINT requisito_cargo_especifico_pkey PRIMARY KEY (id),
    CONSTRAINT requisito_cargo_especifico_id_requisito_fkey FOREIGN KEY (id_requisito) REFERENCES public.requisito(id),
    CONSTRAINT requisito_cargo_especifico_id_cargo_especifico_fkey FOREIGN KEY (id_cargo_especifico) REFERENCES public.cargo_especifico(id)
) INHERITS (public.auditoria);

-- 28. Proceso (Sin dependencias)
CREATE TABLE public.proceso (
    id serial4 NOT NULL,
    nombre varchar(100) NOT NULL,
    detalle varchar(200) NULL,
    orden int4 NOT NULL,
    CONSTRAINT proceso_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 29. Estado (Depende de Proceso)
CREATE TABLE public.estado (
    id serial4 NOT NULL,
    id_proceso int4 NOT NULL,
    nombre varchar(100) NOT NULL,
    detalle varchar(200) NULL,
    es_inicial bool NOT NULL DEFAULT false,
    es_final bool NOT NULL DEFAULT false,
    CONSTRAINT estado_pkey PRIMARY KEY (id),
    CONSTRAINT estado_id_proceso_fkey FOREIGN KEY (id_proceso) REFERENCES public.proceso(id)
) INHERITS (public.auditoria);

-- 30. Tipo Contacto (Sin dependencias)
CREATE TABLE public.tipo_contacto (
    id serial4 NOT NULL,
    nombre varchar(100) NOT NULL,
    CONSTRAINT tipo_contacto_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 31. Mantención (Depende de Faena)
CREATE TABLE public.mantencion (
    id serial4 NOT NULL,
    id_faena int4 NOT NULL,
    nombre varchar(100) NOT NULL,
    descripcion varchar(200) NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado varchar(50) NOT NULL,
    CONSTRAINT mantencion_pkey PRIMARY KEY (id),
    CONSTRAINT mantencion_id_faena_fkey FOREIGN KEY (id_faena) REFERENCES public.faena(id),
    CONSTRAINT mantencion_estado_check CHECK (estado IN ('PLANIFICACION', 'EN_CURSO', 'FINALIZADA', 'CANCELADA', 'SUSPENDIDA'))
) INHERITS (public.auditoria);

-- 32. Requerimiento Dotación (Depende de Mantención y Cargo Base)
CREATE TABLE public.requerimiento_dotacion (
    id serial4 NOT NULL,
    id_mantencion int4 NOT NULL,
    id_cargo_base int4 NOT NULL,
    cantidad int4 NOT NULL,
    observaciones varchar(200) NULL,
    CONSTRAINT requerimiento_dotacion_pkey PRIMARY KEY (id),
    CONSTRAINT requerimiento_dotacion_id_mantencion_fkey FOREIGN KEY (id_mantencion) REFERENCES public.mantencion(id),
    CONSTRAINT requerimiento_dotacion_id_cargo_base_fkey FOREIGN KEY (id_cargo_base) REFERENCES public.cargo_base(id)
) INHERITS (public.auditoria);

-- 33. Nómina (Depende de Mantención)
CREATE TABLE public.nomina (
    id serial4 NOT NULL,
    id_mantencion int4 NOT NULL,
    nombre varchar(100) NOT NULL,
    estado varchar(50) NOT NULL,
    CONSTRAINT nomina_pkey PRIMARY KEY (id),
    CONSTRAINT nomina_id_mantencion_fkey FOREIGN KEY (id_mantencion) REFERENCES public.mantencion(id),
    CONSTRAINT nomina_estado_check CHECK (estado IN ('EN_CREACION', 'ACTIVA', 'FINALIZADA', 'CANCELADA'))
) INHERITS (public.auditoria);

-- 34. Nómina Trabajador (Depende de Nómina, Persona, Cargo Específico y estados)
CREATE TABLE public.nomina_trabajador (
    id serial4 NOT NULL,
    id_nomina int4 NOT NULL,
    id_persona int4 NOT NULL,
    id_cargo_especifico int4 NOT NULL,
    id_estado_disponibilidad int4 NULL,
    id_estado_contratacion int4 NULL,
    id_estado_acreditacion int4 NULL,
    id_estado_habilitacion int4 NULL,
    requiere_acreditacion boolean NOT NULL DEFAULT true,
    requiere_habilitacion boolean NOT NULL DEFAULT true,
    CONSTRAINT nomina_trabajador_pkey PRIMARY KEY (id),
    CONSTRAINT nomina_trabajador_id_nomina_fkey FOREIGN KEY (id_nomina) REFERENCES public.nomina(id),
    CONSTRAINT nomina_trabajador_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT nomina_trabajador_id_cargo_especifico_fkey FOREIGN KEY (id_cargo_especifico) REFERENCES public.cargo_especifico(id),
    CONSTRAINT nomina_trabajador_id_estado_disponibilidad_fkey FOREIGN KEY (id_estado_disponibilidad) REFERENCES public.estado(id),
    CONSTRAINT nomina_trabajador_id_estado_contratacion_fkey FOREIGN KEY (id_estado_contratacion) REFERENCES public.estado(id),
    CONSTRAINT nomina_trabajador_id_estado_acreditacion_fkey FOREIGN KEY (id_estado_acreditacion) REFERENCES public.estado(id),
    CONSTRAINT nomina_trabajador_id_estado_habilitacion_fkey FOREIGN KEY (id_estado_habilitacion) REFERENCES public.estado(id)
) INHERITS (public.auditoria);

-- 35. Historial Proceso Trabajador (Depende de Nómina Trabajador, Proceso y Estado)
CREATE TABLE public.hist_proceso_trabajador (
    id serial4 NOT NULL,
    id_nomina_trabajador int4 NOT NULL,
    id_proceso int4 NOT NULL,
    id_estado_anterior int4 NULL,
    id_estado_nuevo int4 NOT NULL,
    fecha_cambio timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones varchar(200) NULL,
    CONSTRAINT hist_proceso_trabajador_pkey PRIMARY KEY (id),
    CONSTRAINT hist_proceso_trabajador_id_nomina_trabajador_fkey FOREIGN KEY (id_nomina_trabajador) REFERENCES public.nomina_trabajador(id),
    CONSTRAINT hist_proceso_trabajador_id_proceso_fkey FOREIGN KEY (id_proceso) REFERENCES public.proceso(id),
    CONSTRAINT hist_proceso_trabajador_id_estado_anterior_fkey FOREIGN KEY (id_estado_anterior) REFERENCES public.estado(id),
    CONSTRAINT hist_proceso_trabajador_id_estado_nuevo_fkey FOREIGN KEY (id_estado_nuevo) REFERENCES public.estado(id)
) INHERITS (public.auditoria);

-- 36. Cumplimiento Requisito (Depende de Persona y Requisito)
CREATE TABLE public.cumplimiento_requisito (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_requisito int4 NOT NULL,
    fecha_cumplimiento date NOT NULL,
    fecha_vencimiento date NULL,
    estado varchar(50) NOT NULL,
    observaciones varchar(200) NULL,
    documento_url varchar(255) NULL,
    CONSTRAINT cumplimiento_requisito_pkey PRIMARY KEY (id),
    CONSTRAINT cumplimiento_requisito_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT cumplimiento_requisito_id_requisito_fkey FOREIGN KEY (id_requisito) REFERENCES public.requisito(id),
    CONSTRAINT cumplimiento_requisito_estado_check CHECK (estado IN ('VIGENTE', 'VENCIDO', 'PENDIENTE', 'RECHAZADO'))
) INHERITS (public.auditoria);

-- 37. Contacto (Depende de Persona, Tipo Contacto y Nómina Trabajador)
CREATE TABLE public.contacto (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_tipo_contacto int4 NOT NULL,
    id_nomina_trabajador int4 NOT NULL,
    fecha timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detalle varchar(200) NULL,
    resultado varchar(200) NULL,
    CONSTRAINT contacto_pkey PRIMARY KEY (id),
    CONSTRAINT contacto_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT contacto_id_tipo_contacto_fkey FOREIGN KEY (id_tipo_contacto) REFERENCES public.tipo_contacto(id),
    CONSTRAINT contacto_id_nomina_trabajador_fkey FOREIGN KEY (id_nomina_trabajador) REFERENCES public.nomina_trabajador(id)
) INHERITS (public.auditoria);

-- 38. Contrato Trabajador (Depende de Persona, Mantención y Cargo Específico)
CREATE TABLE public.contrato_trabajador (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_mantencion int4 NOT NULL,
    id_cargo_especifico int4 NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    valor_diario numeric(10,2) NOT NULL,
    estado varchar(50) NOT NULL,
    observaciones varchar(200) NULL,
    contrato_url varchar(255) NULL,
    CONSTRAINT contrato_trabajador_pkey PRIMARY KEY (id),
    CONSTRAINT contrato_trabajador_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT contrato_trabajador_id_mantencion_fkey FOREIGN KEY (id_mantencion) REFERENCES public.mantencion(id),
    CONSTRAINT contrato_trabajador_id_cargo_especifico_fkey FOREIGN KEY (id_cargo_especifico) REFERENCES public.cargo_especifico(id),
    CONSTRAINT contrato_trabajador_estado_check CHECK (estado IN ('ACTIVO', 'FINALIZADO', 'CANCELADO', 'SUSPENDIDO'))
) INHERITS (public.auditoria);

-- 39. Estado Trabajador (Catálogo de estados)
CREATE TABLE public.estado_trabajador (
    id serial4 NOT NULL,
    nombre varchar(50) NOT NULL,
    descripcion varchar(200) NULL,
    prioridad int2 NOT NULL, -- Número menor = mayor prioridad
    CONSTRAINT estado_trabajador_pkey PRIMARY KEY (id)
) INHERITS (public.auditoria);

-- 40. Trabajador Estado (Depende de Persona y Estado Trabajador)
CREATE TABLE public.trabajador_estado (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    id_estado int4 NOT NULL,
    fecha_inicio date NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin date NULL, -- NULL significa indefinido
    motivo varchar(200) NOT NULL,
    observaciones text NULL,
    activo boolean NOT NULL DEFAULT true,
    CONSTRAINT trabajador_estado_pkey PRIMARY KEY (id),
    CONSTRAINT trabajador_estado_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT trabajador_estado_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado_trabajador(id)
) INHERITS (public.auditoria);

-- 41. Registro Falta (Depende de Persona)
CREATE TABLE public.registro_falta (
    id serial4 NOT NULL,
    id_persona int4 NOT NULL,
    fecha date NOT NULL DEFAULT CURRENT_DATE,
    tipo_falta varchar(50) NOT NULL,
    descripcion text NOT NULL,
    reportado_por varchar(100) NULL,
    documento_url varchar(255) NULL,
    gravedad varchar(20) NOT NULL DEFAULT 'LEVE',
    CONSTRAINT registro_falta_pkey PRIMARY KEY (id),
    CONSTRAINT registro_falta_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id),
    CONSTRAINT registro_falta_gravedad_check CHECK (gravedad IN ('LEVE', 'MODERADA', 'GRAVE'))
) INHERITS (public.auditoria);

-- ========================================================
-- CREACIÓN DE ÍNDICES PARA TABLAS DE AUTENTICACIÓN
-- ========================================================

-- Índices para Rol y Permisos
CREATE UNIQUE INDEX idx_rol_permiso_unique ON public.rol_permiso USING btree (id_rol, id_permiso) WHERE (activo = true);
CREATE UNIQUE INDEX idx_permiso_nombre ON public.permiso USING btree (lower(nombre)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_permiso_codigo ON public.permiso USING btree (lower(codigo)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_rol_nombre ON public.rol USING btree (lower(nombre)) WHERE (activo = true);

-- Índices para Región y Ciudad
CREATE UNIQUE INDEX idx_region_nombre ON public.region USING btree (lower(nombre)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_region_numero ON public.region USING btree (lower(numero_region)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_region_codigo ON public.region USING btree (lower(codigo)) WHERE (activo = true);
CREATE INDEX idx_ciudad_region ON public.ciudad USING btree (id_region);
CREATE UNIQUE INDEX idx_ciudad_nombre ON public.ciudad USING btree (lower(nombre)) WHERE (activo = true);

-- Índices para Dirección
CREATE INDEX idx_direccion_ciudad ON public.direccion USING btree (id_ciudad);
CREATE INDEX idx_direccion_persona ON public.direccion USING btree (id_persona);
CREATE INDEX idx_direccion_principal ON public.direccion USING btree (id_persona, principal) WHERE principal = true;

-- Índices para Persona
CREATE INDEX idx_persona_apellidos ON public.persona USING btree (apellido_paterno, apellido_materno);
CREATE UNIQUE INDEX idx_persona_email ON public.persona USING btree (lower((email)::text)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_persona_rut ON public.persona USING btree (rut) WHERE (activo = true);

-- Índices para Teléfono
CREATE INDEX idx_telefono_persona ON public.telefono USING btree (id_persona);
CREATE INDEX idx_telefono_principal ON public.telefono USING btree (id_persona, principal) WHERE (principal = true);
CREATE UNIQUE INDEX idx_telefono_persona_numero ON public.telefono USING btree (id_persona, numero) WHERE (activo = true);
CREATE UNIQUE INDEX idx_telefono_persona_principal ON public.telefono USING btree (id_persona) WHERE (principal = true AND activo = true);

-- Índices para Usuario
CREATE INDEX idx_usuario_persona ON public.usuario USING btree (id_persona);
CREATE INDEX idx_usuario_rol ON public.usuario USING btree (id_rol);
CREATE UNIQUE INDEX idx_usuario_username ON public.usuario USING btree (username) WHERE (activo = true);

-- Índices para Intento Login
CREATE INDEX idx_intento_login_fecha ON public.intento_login USING btree (fecha_intento DESC);
CREATE INDEX idx_intento_login_ip ON public.intento_login USING btree (ip_address);
CREATE INDEX idx_intento_login_usuario_fecha ON public.intento_login USING btree (id_usuario, fecha_intento DESC);

-- Índices para Sesión
CREATE INDEX idx_sesion_fecha_expiracion ON public.sesion USING btree (fecha_expiracion) WHERE (activa = true);
CREATE INDEX idx_sesion_token ON public.sesion USING btree (token) WHERE (activa = true);
CREATE INDEX idx_sesion_usuario ON public.sesion USING btree (id_usuario, activa);
CREATE INDEX idx_sesion_websocket_id ON public.sesion USING btree (websocket_id) WHERE (websocket_connected = true);
CREATE INDEX idx_sesion_websocket_activity ON public.sesion USING btree (last_websocket_activity) WHERE (websocket_connected = true);

-- Índices para Token Recuperación
CREATE INDEX idx_token_recuperacion_token ON public.token_recuperacion USING btree (token) WHERE (usado = false);
CREATE INDEX idx_token_recuperacion_usuario ON public.token_recuperacion USING btree (id_usuario, fecha_expiracion) WHERE (usado = false);

-- Índices para Nacionalidad, Estado Civil y Género
CREATE UNIQUE INDEX idx_nacionalidad_codigo ON public.nacionalidad USING btree (lower(codigo)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_nacionalidad_nombre ON public.nacionalidad USING btree (lower(nombre)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_estado_civil_nombre ON public.estado_civil USING btree (lower(nombre)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_genero_nombre ON public.genero USING btree (lower(nombre)) WHERE (activo = true);

-- Índices para AFP y Sistema de Salud
CREATE UNIQUE INDEX idx_tipo_afp_codigo ON public.tipo_afp USING btree (lower(codigo)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_tipo_afp_nombre ON public.tipo_afp USING btree (lower(nombre)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_tipo_sistema_salud_nombre ON public.tipo_sistema_salud USING btree (lower(nombre)) WHERE (activo = true);
CREATE UNIQUE INDEX idx_tipo_sistema_salud_codigo ON public.tipo_sistema_salud USING btree (lower(codigo)) WHERE (activo = true);
CREATE INDEX idx_tipo_sistema_salud_tipo ON public.tipo_sistema_salud USING btree (tipo);

-- Índices para relaciones Persona-AFP y Persona-Sistema de Salud
CREATE INDEX idx_persona_afp_persona ON public.persona_afp USING btree (id_persona);
CREATE INDEX idx_persona_afp_tipo ON public.persona_afp USING btree (id_tipo_afp);
CREATE INDEX idx_persona_afp_fechas ON public.persona_afp USING btree (fecha_inicio, fecha_fin);
CREATE INDEX idx_persona_sistema_salud_persona ON public.persona_sistema_salud USING btree (id_persona);
CREATE INDEX idx_persona_sistema_salud_tipo ON public.persona_sistema_salud USING btree (id_tipo_sistema_salud);
CREATE INDEX idx_persona_sistema_salud_fechas ON public.persona_sistema_salud USING btree (fecha_inicio, fecha_fin);

-- ========================================================
-- CREACIÓN DE ÍNDICES PARA TABLAS DE GESTIÓN DE MANTENIMIENTO
-- ========================================================

-- Índices para Faena y Cargos
CREATE UNIQUE INDEX idx_faena_codigo ON public.faena USING btree (codigo) WHERE (activo = true);
CREATE UNIQUE INDEX idx_cargo_base_nombre ON public.cargo_base USING btree (lower(nombre)) WHERE (activo = true);
CREATE INDEX idx_cargo_especifico_faena ON public.cargo_especifico USING btree (id_faena);
CREATE INDEX idx_cargo_especifico_cargo_base ON public.cargo_especifico USING btree (id_cargo_base);
CREATE INDEX idx_persona_cargo_persona ON public.persona_cargo USING btree (id_persona);
CREATE INDEX idx_persona_cargo_cargo ON public.persona_cargo USING btree (id_cargo_base);

-- Índices para Requisitos
CREATE UNIQUE INDEX idx_tipo_requisito_nombre ON public.tipo_requisito USING btree (lower(nombre)) WHERE (activo = true);
CREATE INDEX idx_requisito_tipo ON public.requisito USING btree (id_tipo_requisito);
CREATE INDEX idx_requisito_faena_faena ON public.requisito_faena USING btree (id_faena);
CREATE INDEX idx_requisito_faena_requisito ON public.requisito_faena USING btree (id_requisito);
CREATE INDEX idx_requisito_cargo_especifico_cargo ON public.requisito_cargo_especifico USING btree (id_cargo_especifico);
CREATE INDEX idx_requisito_cargo_especifico_requisito ON public.requisito_cargo_especifico USING btree (id_requisito);
CREATE INDEX idx_requisito_cargo_especifico_combinado ON public.requisito_cargo_especifico USING btree (id_requisito, id_cargo_especifico);

-- Índices para Procesos y Estados
CREATE INDEX idx_estado_proceso ON public.estado USING btree (id_proceso);
CREATE INDEX idx_estado_inicial ON public.estado USING btree (id_proceso) WHERE (es_inicial = true);
CREATE INDEX idx_estado_final ON public.estado USING btree (id_proceso) WHERE (es_final = true);

-- Índices para Mantención y Nómina
CREATE INDEX idx_mantencion_faena ON public.mantencion USING btree (id_faena);
CREATE INDEX idx_mantencion_fechas ON public.mantencion USING btree (fecha_inicio, fecha_fin);
CREATE INDEX idx_mantencion_estado ON public.mantencion USING btree (estado);
CREATE INDEX idx_nomina_mantencion ON public.nomina USING btree (id_mantencion);
CREATE INDEX idx_nomina_estado ON public.nomina USING btree (estado);

-- Índices para Nómina Trabajador y Procesos
CREATE INDEX idx_nomina_trabajador_nomina ON public.nomina_trabajador USING btree (id_nomina);
CREATE INDEX idx_nomina_trabajador_persona ON public.nomina_trabajador USING btree (id_persona);
CREATE INDEX idx_nomina_trabajador_cargo_especifico ON public.nomina_trabajador USING btree (id_cargo_especifico);
CREATE INDEX idx_nomina_trabajador_estado_disponibilidad ON public.nomina_trabajador USING btree (id_estado_disponibilidad);
CREATE INDEX idx_nomina_trabajador_estado_contratacion ON public.nomina_trabajador USING btree (id_estado_contratacion);
CREATE INDEX idx_nomina_trabajador_estado_acreditacion ON public.nomina_trabajador USING btree (id_estado_acreditacion);
CREATE INDEX idx_nomina_trabajador_estado_habilitacion ON public.nomina_trabajador USING btree (id_estado_habilitacion);
CREATE INDEX idx_hist_proceso_trabajador_nomina_trab ON public.hist_proceso_trabajador USING btree (id_nomina_trabajador);
CREATE INDEX idx_hist_proceso_trabajador_proceso ON public.hist_proceso_trabajador USING btree (id_proceso);
CREATE INDEX idx_hist_proceso_trabajador_estado_nuevo ON public.hist_proceso_trabajador USING btree (id_estado_nuevo);

-- Índices para Cumplimiento de Requisitos y Contactos
CREATE INDEX idx_cumplimiento_requisito_persona ON public.cumplimiento_requisito USING btree (id_persona);
CREATE INDEX idx_cumplimiento_requisito_requisito ON public.cumplimiento_requisito USING btree (id_requisito);
CREATE INDEX idx_cumplimiento_requisito_estado ON public.cumplimiento_requisito USING btree (estado);
CREATE INDEX idx_cumplimiento_requisito_fechas ON public.cumplimiento_requisito USING btree (fecha_cumplimiento, fecha_vencimiento);
CREATE INDEX idx_contacto_persona ON public.contacto USING btree (id_persona);
CREATE INDEX idx_contacto_nomina_trabajador ON public.contacto USING btree (id_nomina_trabajador);
CREATE INDEX idx_contacto_tipo ON public.contacto USING btree (id_tipo_contacto);

-- Índices para Contratos y Estados de Trabajadores
CREATE INDEX idx_contrato_trabajador_persona ON public.contrato_trabajador USING btree (id_persona);
CREATE INDEX idx_contrato_trabajador_mantencion ON public.contrato_trabajador USING btree (id_mantencion);
CREATE INDEX idx_contrato_trabajador_cargo ON public.contrato_trabajador USING btree (id_cargo_especifico);
CREATE INDEX idx_contrato_trabajador_estado ON public.contrato_trabajador USING btree (estado);
CREATE INDEX idx_contrato_trabajador_fechas ON public.contrato_trabajador USING btree (fecha_inicio, fecha_fin);
CREATE INDEX idx_trabajador_estado_persona ON public.trabajador_estado USING btree (id_persona);
CREATE INDEX idx_trabajador_estado_estado ON public.trabajador_estado USING btree (id_estado);
CREATE INDEX idx_trabajador_estado_fecha_inicio ON public.trabajador_estado USING btree (fecha_inicio);
CREATE INDEX idx_trabajador_estado_fecha_fin ON public.trabajador_estado USING btree (fecha_fin);
CREATE INDEX idx_trabajador_estado_activo ON public.trabajador_estado USING btree (activo);
CREATE INDEX idx_registro_falta_persona ON public.registro_falta USING btree (id_persona);
CREATE INDEX idx_registro_falta_fecha ON public.registro_falta USING btree (fecha);
CREATE INDEX idx_registro_falta_gravedad ON public.registro_falta USING btree (gravedad);

-- ========================================================
-- PERMISOS
-- ========================================================

-- Permisos de esquema
GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;

-- Permisos y ownership de secuencias (solo algunas para ejemplo)
ALTER SEQUENCE public.ciudad_id_seq OWNER TO postgres;
ALTER SEQUENCE public.direccion_id_seq OWNER TO postgres;
ALTER SEQUENCE public.faena_id_seq OWNER TO postgres;
ALTER SEQUENCE public.cargo_base_id_seq OWNER TO postgres;

GRANT ALL ON SEQUENCE public.ciudad_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.direccion_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.faena_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.cargo_base_id_seq TO postgres;

-- Permisos y ownership de tablas (solo algunas para ejemplo)
ALTER TABLE public.auditoria OWNER TO postgres;
ALTER TABLE public.permiso OWNER TO postgres;
ALTER TABLE public.rol OWNER TO postgres;
ALTER TABLE public.persona OWNER TO postgres;
ALTER TABLE public.faena OWNER TO postgres;
ALTER TABLE public.cargo_base OWNER TO postgres;

GRANT ALL ON TABLE public.auditoria TO postgres;
GRANT ALL ON TABLE public.permiso TO postgres;
GRANT ALL ON TABLE public.rol TO postgres;
GRANT ALL ON TABLE public.persona TO postgres;
GRANT ALL ON TABLE public.faena TO postgres;
GRANT ALL ON TABLE public.cargo_base TO postgres;

-- ========================================================
-- COMENTARIOS DE TABLAS Y COLUMNAS
-- ========================================================

COMMENT ON TABLE public.auditoria IS 'Tabla base con campos de auditoría para heredar';
COMMENT ON TABLE public.permiso IS 'Catálogo de permisos disponibles en el sistema';
COMMENT ON TABLE public.rol IS 'Catálogo de roles del sistema';
COMMENT ON TABLE public.rol_permiso IS 'Relación entre roles y sus permisos asignados';
COMMENT ON TABLE public.region IS 'Catálogo de regiones de Chile';
COMMENT ON TABLE public.ciudad IS 'Catálogo de ciudades de Chile';
COMMENT ON TABLE public.direccion IS 'Almacena las direcciones físicas';
COMMENT ON TABLE public.persona IS 'Almacena la información personal de individuos';
COMMENT ON TABLE public.telefono IS 'Almacena los números de teléfono asociados a las personas';
COMMENT ON TABLE public.usuario IS 'Usuarios con acceso al sistema';
-- Continuación de comentarios de tablas
COMMENT ON TABLE public.intento_login IS 'Registro de intentos de inicio de sesión';
COMMENT ON TABLE public.sesion IS 'Control de sesiones activas de usuarios';
COMMENT ON TABLE public.token_recuperacion IS 'Tokens para recuperación de contraseñas';
COMMENT ON TABLE public.nacionalidad IS 'Catálogo de nacionalidades';
COMMENT ON TABLE public.estado_civil IS 'Catálogo de estados civiles';
COMMENT ON TABLE public.genero IS 'Catálogo de géneros';
COMMENT ON TABLE public.tipo_afp IS 'Catálogo de Administradoras de Fondos de Pensiones';
COMMENT ON TABLE public.tipo_sistema_salud IS 'Catálogo de sistemas de salud (FONASA/ISAPRE)';
COMMENT ON TABLE public.persona_afp IS 'Relación histórica entre personas y AFPs';
COMMENT ON TABLE public.persona_sistema_salud IS 'Relación histórica entre personas y sistemas de salud';
COMMENT ON TABLE public.faena IS 'Lugares o sitios donde se realizan las mantenciones';
COMMENT ON TABLE public.cargo_base IS 'Catálogo de cargos base del sistema';
COMMENT ON TABLE public.cargo_especifico IS 'Especialización de cargos para faenas específicas con valor diario';
COMMENT ON TABLE public.persona_cargo IS 'Relación entre personas y sus cargos/especialidades';
COMMENT ON TABLE public.tipo_requisito IS 'Categorías de requisitos (documentos, certificaciones, etc.)';
COMMENT ON TABLE public.requisito IS 'Requisitos específicos que deben cumplir los trabajadores';
COMMENT ON TABLE public.requisito_faena IS 'Requisitos específicos para cada faena';
COMMENT ON TABLE public.requisito_cargo_especifico IS 'Requisitos específicos para cada cargo en una faena';
COMMENT ON TABLE public.proceso IS 'Procesos de negocio del sistema de mantenimiento';
COMMENT ON TABLE public.estado IS 'Estados posibles dentro de cada proceso';
COMMENT ON TABLE public.tipo_contacto IS 'Tipos de contacto con los trabajadores';
COMMENT ON TABLE public.mantencion IS 'Registro de mantenciones programadas';
COMMENT ON TABLE public.requerimiento_dotacion IS 'Necesidades de personal para cada mantención';
COMMENT ON TABLE public.nomina IS 'Nóminas de trabajadores para mantenciones';
COMMENT ON TABLE public.nomina_trabajador IS 'Trabajadores incluidos en cada nómina con sus estados';
COMMENT ON TABLE public.hist_proceso_trabajador IS 'Historial de cambios de estado de los trabajadores';
COMMENT ON TABLE public.cumplimiento_requisito IS 'Registro del cumplimiento de requisitos por trabajador';
COMMENT ON TABLE public.contacto IS 'Registro de comunicaciones con los trabajadores';
COMMENT ON TABLE public.contrato_trabajador IS 'Contratos formalizados con trabajadores';
COMMENT ON TABLE public.estado_trabajador IS 'Catálogo de estados posibles para trabajadores';
COMMENT ON TABLE public.trabajador_estado IS 'Asignación de estados a trabajadores con vigencia';
COMMENT ON TABLE public.registro_falta IS 'Registro de faltas o incumplimientos de los trabajadores';