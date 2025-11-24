import { EmployeeResponseDto } from "./EmployeeResponseDto";

export interface OrderServiceSessionResponseDto {
    orderServiceId: string;
    dataSessao: string;
    horaSessao: string;
    statusSessao: number;
    observacaoSessao?: string;
    funcionario?: EmployeeResponseDto;
  }