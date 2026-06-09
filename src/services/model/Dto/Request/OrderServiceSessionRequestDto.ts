import { BaseRequestDto } from "./BaseRequestDto";
import { EmployeeRequestDto } from "./EmployeeRequestDto";
import { OrderServiceRequestDto } from "./OrderServiceRequestDto";

export interface OrderServiceSessionRequestDto extends BaseRequestDto {
  clienteId: string;
  orderServiceId: string;
  dataSessao: string;
  horaSessao: string;
  statusSessao: number;
  /** 0 = Fisio (informativo), 1 = Plano (debita QtdSessaoRealizada) */
  tipoCheckIn?: number;
  observacaoSessao?: string;
  funcionario?: EmployeeRequestDto;
  ordemServico?: OrderServiceRequestDto;
}