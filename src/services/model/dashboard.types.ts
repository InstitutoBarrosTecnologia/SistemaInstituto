// Tipos para Dashboard API

export interface DashboardFilterRequestDto {
  periodo?: string;
  dataInicio?: string;
  dataFim?: string;
  filialId?: string;
  funcionarioId?: string;
}

// Resposta para indicadores simples (pacientes ativos, avaliações executadas)
export interface DashboardIndicatorResponse {
  total: number;
  variacao: number;
}

// Resposta para indicadores por período (agendamentos, avaliações, sessões)
export interface DashboardPeriodResponse {
  periodo: string;
  total: number;
  variacao: number;
}

// Resposta para sessões canceladas
export interface DashboardCanceledSessionsResponse {
  periodo: string;
  total: number;
  percentual: number;
  variacao: number;
}

// Resposta para gráfico mensal
export interface DashboardMonthlyChartResponse {
  meses: string[];
  valores: number[];
}

// Resposta para gráfico mensal com múltiplas séries
export interface DashboardMonthlyMultiSeriesResponse {
  meses: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

// Resposta para distribuição por unidades
export interface DashboardUnitDistributionResponse {
  unidade: string;
  total: number;
}

// Resposta para serviços mais agendados
export interface DashboardTopServicesResponse {
  servico: string;
  total: number;
}

// Resposta para sessões por fisioterapeuta
export interface DashboardPhysiotherapistSessionsResponse {
  fisioterapeuta: string;
  total: number;
}

// Estado do Dashboard
export interface DashboardState {
  // Indicadores simples
  pacientesAtivos: DashboardIndicatorResponse | null;
  avaliacoesExecutadas: DashboardIndicatorResponse | null;
  
  // Indicadores por período
  agendamentosMes: DashboardPeriodResponse | null;
  agendamentosSemana: DashboardPeriodResponse | null;
  agendamentosDia: DashboardPeriodResponse | null;
  
  avaliacoesAgendadasMes: DashboardPeriodResponse | null;
  avaliacoesAgendadasSemana: DashboardPeriodResponse | null;
  avaliacoesAgendadasDia: DashboardPeriodResponse | null;
  
  sessoesMes: DashboardPeriodResponse | null;
  sessoesSemana: DashboardPeriodResponse | null;
  sessoesDia: DashboardPeriodResponse | null;
  
  // Sessões canceladas
  sessoesCanceladas: DashboardCanceledSessionsResponse | null;
  
  // Gráficos
  sessoesMensais: DashboardMonthlyChartResponse | null;
  sessoesMensaisMulti: DashboardMonthlyMultiSeriesResponse | null; // Novo campo para múltiplas séries
  unidadesDistribuicao: DashboardUnitDistributionResponse[];
  servicosMaisAgendados: DashboardTopServicesResponse[];
  sessoesPorFisioterapeuta: DashboardPhysiotherapistSessionsResponse[];
  
  // Estados de loading
  loading: {
    pacientesAtivos: boolean;
    agendamentos: boolean;
    avaliacoes: boolean;
    sessoes: boolean;
    graficos: boolean;
  };
  
  // Erros
  error: string | null;
}
