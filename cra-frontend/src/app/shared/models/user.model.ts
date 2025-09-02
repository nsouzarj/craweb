export interface User {
  id?: number;
  login: string;
  senha?: string;
  nomecompleto: string;
  emailprincipal?: string;
  emailsecundario?: string;
  emailresponsavel?: string;
  tipo: UserType;
  ativo: boolean;
  dataEntrada?: string;
  authorities?: string[];
}

export enum UserType {
  ADMIN = 1,
  ADVOGADO = 2,
  CORRESPONDENTE = 3
}

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface RegisterRequest {
  login: string;
  senha: string;
  nomecompleto: string;
  emailprincipal?: string;
  emailsecundario?: string;
  emailresponsavel?: string;
  tipo: UserType;
}

export interface JwtResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  login: string;
  nomecompleto: string;
  emailprincipal?: string;
  tipo: UserType;
  roles: string[];
  expiresAt: string;
}