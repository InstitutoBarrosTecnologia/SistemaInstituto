import { CustomerRequestDto } from "../Request/CustomerRequestDto";
import { EmployeeRequestDto } from "../Request/EmployeeRequestDto";
import { OrderServiceSessionRequestDto } from "../Request/OrderServiceSessionRequestDto";
import { ServiceRequestDto } from "../Request/ServiceRequestDto";
import { BaseResponseDto } from "./BaseResponseDto";

export interface OrderServiceResponseDto extends BaseResponseDto {
  id?: string;
  referencia?: string;
  status: number;
  precoOrdem?: number;
  precoDesconto?: number;
  precoDescontado?: number;
  descontoPercentual?: number;
  percentualGanho?: number;
  formaPagamento: number;
  dataPagamento?: string;
  dataConclusaoServico?: string;
  clienteId?: string;
  funcionarioId?: string;
  qtdSessaoTotal?: number;
  qtdSessaoRealizada?: number;
  funcionario?: EmployeeRequestDto;
  cliente?: CustomerRequestDto;
  servicos?: ServiceRequestDto[];
  sessoes?: OrderServiceSessionRequestDto[];
}
