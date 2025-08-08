export interface DailySessionsSummaryResponseDto {
  totalSessoes: number;
  data: string; // ISO date string
  sessoes: SessionDetailResponseDto[];
}

export interface SessionDetailResponseDto {
  sessionId: string;
  dataSessao: string; // ISO date string
  horaSessao: string; // Time format HH:mm:ss
  statusSessao: string;
  observacaoSessao?: string;
  
  // Dados do Fisioterapeuta/Funcionário
  funcionarioId?: string;
  nomeFuncionario: string;
  emailFuncionario?: string;
  
  // Dados do Cliente
  clienteId?: string;
  nomeCliente: string;
  emailCliente?: string;
  telefoneCliente?: string;
}
