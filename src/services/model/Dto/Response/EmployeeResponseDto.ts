import { BaseResponseDto } from "./BaseResponseDto";

export interface EmployeeResponseDto extends BaseResponseDto {
    id?: string;
    nome?: string;
    telefone?: string;
    email?: string;
    rg?: string;
    cpf?: string;
    endereco?: string;
    cargo?: string;
    filialId?: string;
  }