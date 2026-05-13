/** Contratos alineados con `src/api/*.py` del backend FastAPI. */

export interface UsuarioRead {
    id_usuario: string;
    nombre: string;
    nombre_usuario: string;
    email: string;
    rol: string;
    telefono: string | null;
    activo: boolean;
  }
  
  export interface UsuarioCreate {
    nombre: string;
    nombre_usuario: string;
    email: string;
    contraseña: string;
    rol: string;
    telefono?: string | null;
    activo?: boolean;
  }
  
  export interface UsuarioUpdate {
    nombre?: string;
    nombre_usuario?: string;
    email?: string;
    contraseña_hash?: string;
    rol?: string;
    telefono?: string | null;
    activo?: boolean;
  }

  export interface CuentaRead{
    id_cuenta: string;
    id_usuario: string;
    id_sucursal:string;
    id_tipo_cuenta: string;
    numero_cuenta: string;
    saldo: number;
    id_usuario_creacion: string;
    id_usuario_edita: string | null;
    fecha_creacion: string | null;
    fecha_edicion: string | null;
}

export interface CuentaCreate{
    id_usuario: string;
    id_sucursal:string;
    id_tipo_cuenta: string;
    numero_cuenta: string;
    saldo?: number;
    id_usuario_creacion: string;
}

export interface CuentaUpdate{
    id_sucursal?:string;
    id_tipo_cuenta?: string;
    numero_cuenta?: string;
    saldo?: number;
    id_usuario_edita: string;
}

  
export interface TipoCuentaRead {
  id_tipo_cuenta: string;
  codigo: string;
  nombre: string;
  id_usuario_creacion: string;
  id_usuario_edita?: string | null;
  fecha_creacion?: string | null;
  fecha_edicion?: string | null;
}

export interface TipoCuentaCreate {
  codigo: string;
  nombre: string;
  id_usuario_creacion: string;
}

export interface TipoCuentaUpdate {
  codigo?: string;
  nombre?: string;
  id_usuario_edita: string;
}