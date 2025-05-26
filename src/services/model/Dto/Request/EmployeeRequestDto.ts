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
  }