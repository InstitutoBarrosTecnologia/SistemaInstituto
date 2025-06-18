import { BaseRequestDto } from "./BaseRequestDto";

export interface EmployeeRequestDto extends BaseRequestDto {
  nome?: string;
  telefone?: string;
  email?: string;
  rg?: string;
  cpf?: string;
  endereco?: string;
  cargo?: string;
  filialId?: string;
  crefito?: string;
  role?: string;
  userName?: string;
  emailUser?: string;
  password?: string;
  createUser?: boolean;
}