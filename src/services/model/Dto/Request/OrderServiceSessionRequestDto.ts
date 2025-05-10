import { EmployeeRequestDto } from "./EmployeeRequestDto";
import { OrderServiceRequestDto } from "./OrderServiceRequestDto";

export interface OrderServiceSessionRequestDto {
    id?: string;
    orderServiceId: string;
    dataSessao: string;
    horaSessao: string;
    statusSessao: number;
    observacaoSessao?: string;
    funcionario?: EmployeeRequestDto;
    ordemServico?: OrderServiceRequestDto;
  }