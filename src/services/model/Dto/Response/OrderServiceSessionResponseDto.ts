import { EmployeeResponseDto } from "./EmployeeResponseDto";
import { CustomerResponseDto } from "./CustomerResponseDto";

export interface OrderServiceSessionResponseDto {
    id: string;
    orderServiceId: string;
    clienteId?: string;
    dataSessao: string;
    horaSessao: string;
    statusSessao: number;
    observacaoSessao?: string;
    funcionario?: EmployeeResponseDto;
    cliente?: CustomerResponseDto;
  }