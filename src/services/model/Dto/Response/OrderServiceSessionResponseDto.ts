import { EmployeeResponseDto } from "./EmployeeResponseDto";
import { CustomerResponseDto } from "./CustomerResponseDto";

export interface OrderServiceSessionResponseDto {
    id: string;
    orderServiceId: string;
    clienteId?: string;
    dataSessao: string;
    horaSessao: string;
    statusSessao: number;
    /** 0 = Fisio (informativo), 1 = Plano (debita QtdSessaoRealizada) */
    tipoCheckIn?: number;
    observacaoSessao?: string;
    funcionario?: EmployeeResponseDto;
    cliente?: CustomerResponseDto;
  }