import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import {
  DashboardState,
  DashboardFilterRequestDto,
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
    patologiasAgrupadas: [],
    
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

      // Preparar filtros para o gráfico mensal (ano todo)
      const anoAtual = new Date().getFullYear();
      const inicioAno = `${anoAtual}-01-01`;
      const fimAno = `${anoAtual}-12-31`;
      const filtroAnoCompleto = {
        ...filter,
        dataInicio: inicioAno,
        dataFim: fimAno
      };

      // Buscar todos os dados em paralelo
      const [
        pacientesAtivos,
        agendamentosMes,
        agendamentosSemana,
        agendamentosDia,
        avaliacoesAgendadasMes,
        avaliacoesAgendadasSemana,
        avaliacoesAgendadasDia,
        avaliacoesExecutadas,
        sessoesMes,
        sessoesSemana,
        sessoesDia,
        sessoesCanceladas,
        sessoesMensaisMulti,
        unidadesDistribuicao,
        servicosMaisAgendados,
        sessoesPorFisioterapeuta,
        patologiasAgrupadas,
      ] = await Promise.all([
        DashboardService.getPacientesAtivos(filter),
        DashboardService.getAgendamentosMarcados({ ...filter, periodo: 'mes' }),
        DashboardService.getAgendamentosMarcados({ ...filter, periodo: 'semana' }),
        DashboardService.getAgendamentosMarcados({ ...filter, periodo: 'dia' }),
        DashboardService.getAvaliacoesAgendadas({ ...filter, periodo: 'mes' }),
        DashboardService.getAvaliacoesAgendadas({ ...filter, periodo: 'semana' }),
        DashboardService.getAvaliacoesAgendadas({ ...filter, periodo: 'dia' }),
        DashboardService.getAvaliacoesExecutadas(filter),
        DashboardService.getSessoesRealizadas({ ...filter, periodo: 'mes' }),
        DashboardService.getSessoesRealizadas({ ...filter, periodo: 'semana' }),
        DashboardService.getSessoesRealizadas({ ...filter, periodo: 'dia' }),
        DashboardService.getSessoesCanceladas({ ...filter, periodo: 'dia' }),
        DashboardService.getSessoesMensaisMultiSeries(filtroAnoCompleto),
        DashboardService.getUnidadesDistribuicao(filter),
        DashboardService.getServicosMaisAgendados(filter),
        DashboardService.getSessoesPorFisioterapeuta(filter),
        DashboardService.getPatologiasAgrupadas(filter),
      ]);

      setState(prev => ({
        ...prev,
        // Indicadores simples
        pacientesAtivos,
        avaliacoesExecutadas,
        
        // Indicadores por período - agora usando valores diretos das chamadas específicas
        agendamentosMes: Array.isArray(agendamentosMes) ? agendamentosMes[0] || null : agendamentosMes,
        agendamentosSemana: Array.isArray(agendamentosSemana) ? agendamentosSemana[0] || null : agendamentosSemana,
        agendamentosDia: Array.isArray(agendamentosDia) ? agendamentosDia[0] || null : agendamentosDia,
        
        avaliacoesAgendadasMes: Array.isArray(avaliacoesAgendadasMes) ? avaliacoesAgendadasMes[0] || null : avaliacoesAgendadasMes,
        avaliacoesAgendadasSemana: Array.isArray(avaliacoesAgendadasSemana) ? avaliacoesAgendadasSemana[0] || null : avaliacoesAgendadasSemana,
        avaliacoesAgendadasDia: Array.isArray(avaliacoesAgendadasDia) ? avaliacoesAgendadasDia[0] || null : avaliacoesAgendadasDia,
        
        sessoesMes: Array.isArray(sessoesMes) ? sessoesMes[0] || null : sessoesMes,
        sessoesSemana: Array.isArray(sessoesSemana) ? sessoesSemana[0] || null : sessoesSemana,
        sessoesDia: Array.isArray(sessoesDia) ? sessoesDia[0] || null : sessoesDia,
        
        // Sessões canceladas
        sessoesCanceladas,
        
        // Gráficos
        sessoesMensais: null, // Manter compatibilidade com modelo antigo
        sessoesMensaisMulti,
        unidadesDistribuicao,
        servicosMaisAgendados,
        sessoesPorFisioterapeuta,
        patologiasAgrupadas,
        
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
