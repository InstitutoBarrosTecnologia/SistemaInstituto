import { BaseResponseDto } from "./BaseResponseDto";

export interface EmployeeResponseDto extends BaseResponseDto {
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