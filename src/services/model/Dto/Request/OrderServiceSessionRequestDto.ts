import { BaseRequestDto } from "./BaseRequestDto";
import { EmployeeRequestDto } from "./EmployeeRequestDto";
import { OrderServiceRequestDto } from "./OrderServiceRequestDto";

export interface OrderServiceSessionRequestDto extends BaseRequestDto {
  clienteId: string;
  orderServiceId: string;
  dataSessao: string;
  horaSessao: string;
  statusSessao: number;
  observacaoSessao?: string;
  funcionario?: EmployeeRequestDto;
  ordemServico?: OrderServiceRequestDto;
}