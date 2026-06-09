import { EmployeeResponseDto } from "./EmployeeResponseDto";
import { CustomerResponseDto } from "./CustomerResponseDto";
import { ETipoCheckIn } from "../../Enum/ETipoCheckIn";

export interface OrderServiceSessionResponseDto {
    id: string;
    orderServiceId: string;
    clienteId?: string;
    dataSessao: string;
    horaSessao: string;
    statusSessao: number;
    tipoCheckIn: ETipoCheckIn;
    observacaoSessao?: string;
    funcionario?: EmployeeResponseDto;
    cliente?: CustomerResponseDto;
  }