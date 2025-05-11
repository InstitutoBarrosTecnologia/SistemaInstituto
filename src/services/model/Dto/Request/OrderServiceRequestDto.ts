import { BaseResponseDto } from "../Response/BaseResponseDto";
import { CustomerRequestDto } from "./CustomerRequestDto";
import { EmployeeRequestDto } from "./EmployeeRequestDto";
import { OrderServiceSessionRequestDto } from "./OrderServiceSessionRequestDto";
import { ServiceRequestDto } from "./ServiceRequestDto";

export interface OrderServiceRequestDto extends BaseResponseDto {
  id?: string;
  referencia?: string;
  status: number;
  funcionarioId?: string;
  clienteId?: string;
  qtdSessaoTotal?: number;
  qtdSessaoRealizada?: number;
  precoOrdem?: number;
  precoDesconto?: number;
  descontoPercentual?: number;
  percentualGanho?: number;
  precoDescontado?: number;
  formaPagamento: number;
  dataPagamento?: string;
  dataConclusaoServico?: string;
  funcionario?: EmployeeRequestDto;
  cliente?: CustomerRequestDto;
  servicos?: ServiceRequestDto[];
  sessoes?: OrderServiceSessionRequestDto[];
}
