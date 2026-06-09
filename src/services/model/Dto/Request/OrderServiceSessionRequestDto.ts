import { BaseRequestDto } from "./BaseRequestDto";
import { EmployeeRequestDto } from "./EmployeeRequestDto";
import { OrderServiceRequestDto } from "./OrderServiceRequestDto";
import { ETipoCheckIn } from "../../Enum/ETipoCheckIn";

export interface OrderServiceSessionRequestDto extends BaseRequestDto {
  clienteId: string;
  orderServiceId: string;
  dataSessao: string;
  horaSessao: string;
  statusSessao: number;
  tipoCheckIn: ETipoCheckIn;
  observacaoSessao?: string;
  funcionario?: EmployeeRequestDto;
  ordemServico?: OrderServiceRequestDto;
}