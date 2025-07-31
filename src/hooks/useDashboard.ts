import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import {
  DashboardState,
  DashboardFilterRequestDto,
  DashboardPeriodResponse,
} from '../services/model/dashboard.types';

export const useDashboard = (filter: DashboardFilterRequestDto = {}) => {
  const [state, setState] = useState<DashboardState>({
    // Indicadores simples
    pacientesAtivos: null,
    avaliacoesExecutadas: null,
    
    // Indicadores por período
    agendamentosMes: null,
    agendamentosSemana: null,
    agendamentosDia: null,
    
    avaliacoesAgendadasMes: null,
    avaliacoesAgendadasSemana: null,
    avaliacoesAgendadasDia: null,
    
    sessoesMes: null,
    sessoesSemana: null,
    sessoesDia: null,
    
    // Sessões canceladas
    sessoesCanceladas: null,
    
    // Gráficos
    sessoesMensais: null,
    sessoesMensaisMulti: null,
    unidadesDistribuicao: [],
    servicosMaisAgendados: [],
    sessoesPorFisioterapeuta: [],
    
    // Estados de loading
    loading: {
      pacientesAtivos: false,
      agendamentos: false,
      avaliacoes: false,
      sessoes: false,
      graficos: false,
    },
    
    // Erros
    error: null,
  });

  // Função para buscar dados por período específico
  const findByPeriod = (data: DashboardPeriodResponse[], periodo: string): DashboardPeriodResponse | null => {
    return data.find(item => item.periodo === periodo) || null;
  };

  // Carregar todos os dados
  const carregarDados = async () => {
    try {
      setState(prev => ({
        ...prev,
        loading: {
          pacientesAtivos: true,
          agendamentos: true,
          avaliacoes: true,
          sessoes: true,
          graficos: true,
        },
        error: null,
      }));

      // Buscar todos os dados em paralelo
      const [
        pacientesAtivos,
        agendamentosMarcados,
        avaliacoesAgendadas,
        avaliacoesExecutadas,
        sessoesRealizadas,
        sessoesCanceladas,
        sessoesMensaisMulti,
        unidadesDistribuicao,
        servicosMaisAgendados,
        sessoesPorFisioterapeuta,
      ] = await Promise.all([
        DashboardService.getPacientesAtivos(filter),
        DashboardService.getAgendamentosMarcados(filter),
        DashboardService.getAvaliacoesAgendadas(filter),
        DashboardService.getAvaliacoesExecutadas(filter),
        DashboardService.getSessoesRealizadas(filter),
        DashboardService.getSessoesCanceladas({ ...filter, periodo: 'dia' }),
        DashboardService.getSessoesMensaisMultiSeries(filter),
        DashboardService.getUnidadesDistribuicao(filter),
        DashboardService.getServicosMaisAgendados(filter),
        DashboardService.getSessoesPorFisioterapeuta(filter),
      ]);

      setState(prev => ({
        ...prev,
        // Indicadores simples
        pacientesAtivos,
        avaliacoesExecutadas,
        
        // Indicadores por período
        agendamentosMes: findByPeriod(agendamentosMarcados, 'mes'),
        agendamentosSemana: findByPeriod(agendamentosMarcados, 'semana'),
        agendamentosDia: findByPeriod(agendamentosMarcados, 'dia'),
        
        avaliacoesAgendadasMes: findByPeriod(avaliacoesAgendadas, 'mes'),
        avaliacoesAgendadasSemana: findByPeriod(avaliacoesAgendadas, 'semana'),
        avaliacoesAgendadasDia: findByPeriod(avaliacoesAgendadas, 'dia'),
        
        sessoesMes: findByPeriod(sessoesRealizadas, 'mes'),
        sessoesSemana: findByPeriod(sessoesRealizadas, 'semana'),
        sessoesDia: findByPeriod(sessoesRealizadas, 'dia'),
        
        // Sessões canceladas
        sessoesCanceladas,
        
        // Gráficos
        sessoesMensais: null, // Manter compatibilidade com modelo antigo
        sessoesMensaisMulti,
        unidadesDistribuicao,
        servicosMaisAgendados,
        sessoesPorFisioterapeuta,
        
        // Estados de loading
        loading: {
          pacientesAtivos: false,
          agendamentos: false,
          avaliacoes: false,
          sessoes: false,
          graficos: false,
        },
        
        error: null,
      }));

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setState(prev => ({
        ...prev,
        loading: {
          pacientesAtivos: false,
          agendamentos: false,
          avaliacoes: false,
          sessoes: false,
          graficos: false,
        },
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    carregarDados();
  }, []);

  return {
    ...state,
    recarregarDados: carregarDados,
    isLoading: Object.values(state.loading).some(loading => loading),
  };
};
