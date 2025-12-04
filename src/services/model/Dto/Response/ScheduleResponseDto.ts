import { CustomerResponseDto } from "./CustomerResponseDto";
import { EmployeeResponseDto } from "./EmployeeResponseDto";

export interface ScheduleResponseDto {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: Date; 
  dataFim: Date;   
  diaTodo: boolean;
  usuarioResponsavelId?: string | null;
  idCliente?: string | null;
  idFuncionario?: string | null;
  filialId?: string | null;
  clienteId?: string | null;
  funcionarioId?: string | null;
  cliente?: CustomerResponseDto | null;
  funcionario?: EmployeeResponseDto | null;
  localizacao: string;
  observacao: string;
  notificar: boolean;
  minutosAntesNotificacao?: number | null;
  status: number;
  corFuncionario?: string;
}
