export interface ScheduleRequestDto {
    id?: string; // Optional for new schedules
    titulo: string;
    descricao: string;
    dataInicio?: string; // ISO 8601 date format (ex: '2025-06-03T14:00:00')
    dataFim?: string;
    diaTodo: boolean;
    usuarioResponsavelId?: string;
    clienteId?: string;
    funcionarioId?: string;
    filialId?: string;
    localizacao: string;
    observacao: string;
    notificar: boolean;
    minutosAntesNotificacao?: number;
    status: number;
    corFuncionario?: string;
  }