import { BaseResponseDto } from "./BaseResponseDto";
import { EmployeeResponseDto } from "./EmployeeResponseDto";
import { OrderServiceResponseDto } from "./OrderServiceResponseDto";
import { ScheduleResponseDto } from "./ScheduleResponseDto";

export interface OrderServiceSessionResponseDto extends BaseResponseDto {
    id?: string;
    orderServiceId: string;
    dataSessao: string;
    horaSessao: string;
    statusSessao: number;
    observacaoSessao?: string;
    funcionario?: EmployeeResponseDto;
    ordemServico?: OrderServiceResponseDto;
    agendamentos?: ScheduleResponseDto[];
  }