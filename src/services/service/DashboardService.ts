import { instanceApi } from './AxioService';
import {
  DashboardFilterRequestDto,
  DashboardIndicatorResponse,
  DashboardPeriodResponse,
  DashboardCanceledSessionsResponse,
  DashboardMonthlyChartResponse,
  DashboardMonthlyMultiSeriesResponse,
  DashboardUnitDistributionResponse,
  DashboardTopServicesResponse,
  DashboardPhysiotherapistSessionsResponse,
  DashboardFaturamentoResponseDto,
  DashboardDespesasResponseDto,
  DashboardEntradaSaidaResponseDto,
  DashboardTipoPagamentoResponseDto,
  DashboardUnidadeTransacaoResponseDto,
  DashboardFaturamentoMensalResponseDto,
  DashboardFaturamentoComparativoResponseDto,
  DashboardServicoReceitaResponseDto,
} from '../model/dashboard.types';
import { DashboardPathologyResponseDto } from '../model/Dto/Response/DashboardPathologyResponseDto';

class DashboardService {
  private baseUrl = '/Dashboard';

  /**
   * Retorna o número total de pacientes ativos no período
   */
  async getPacientesAtivos(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardIndicatorResponse> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/pacientes-ativos?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna a quantidade de agendamentos marcados por período
   */
  async getAgendamentosMarcados(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardPeriodResponse[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/agendamentos-marcados?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna o número de avaliações agendadas por período
   */
  async getAvaliacoesAgendadas(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardPeriodResponse[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/avaliacoes-agendadas?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna o número de avaliações realizadas no período
   */
  async getAvaliacoesExecutadas(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardIndicatorResponse> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/avaliacoes-executadas?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna o número de sessões realizadas por período
   */
  async getSessoesRealizadas(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardPeriodResponse[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/sessoes-realizadas?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna o número ou percentual de sessões canceladas por período
   */
  async getSessoesCanceladas(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardCanceledSessionsResponse> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/sessoes-canceladas?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna a evolução mensal das sessões para gráfico
   */
  async getSessoesMensais(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardMonthlyChartResponse> {
    const params = new URLSearchParams();
    
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/sessoes-mensais?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna as sessões mensais com múltiplas séries (realizadas, canceladas, reagendadas)
   */
  async getSessoesMensaisMultiSeries(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardMonthlyMultiSeriesResponse> {
    const params = new URLSearchParams();
    
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/sessoes-mensais-multi?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna a quantidade de sessões/agendamentos por unidade
   */
  async getUnidadesDistribuicao(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardUnitDistributionResponse[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/unidades-distribuicao?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna os serviços mais agendados no mês
   */
  async getServicosMaisAgendados(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardTopServicesResponse[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/servicos-mais-agendados?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna a quantidade de sessões realizadas por cada fisioterapeuta no mês
   */
  async getSessoesPorFisioterapeuta(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardPhysiotherapistSessionsResponse[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);

    const response = await instanceApi.get(
      `${this.baseUrl}/sessoes-por-fisioterapeuta?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Retorna as patologias dos clientes agrupadas por quantidade
   */
  async getPatologiasAgrupadas(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardPathologyResponseDto[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);
    if (filter.funcionarioId) params.append('funcionarioId', filter.funcionarioId);

    const response = await instanceApi.get(
      `${this.baseUrl}/patologias-agrupadas?${params.toString()}`
    );
    return response.data || [];
  }

  /**
   * Retorna dados de faturamento para o dashboard
   */
  async getFaturamento(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardFaturamentoResponseDto | null> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);

    try {
      const response = await instanceApi.get(
        `${this.baseUrl}/faturamento?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de faturamento:', error);
      return null;
    }
  }

  /**
   * Retorna dados de despesas para o dashboard
   */
  async getDespesas(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardDespesasResponseDto | null> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);

    try {
      const response = await instanceApi.get(
        `${this.baseUrl}/despesas?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de despesas:', error);
      return null;
    }
  }

  /**
   * Retorna a distribuição de entrada e saída para gráfico de pizza
   */
  async getEntradaSaida(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardEntradaSaidaResponseDto[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);

    try {
      const response = await instanceApi.get(
        `${this.baseUrl}/entrada-saida?${params.toString()}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar dados de entrada e saída:', error);
      return [];
    }
  }

  /**
   * Retorna a distribuição por tipos de pagamento
   */
  async getTiposPagamento(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardTipoPagamentoResponseDto[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);

    try {
      const response = await instanceApi.get(
        `${this.baseUrl}/tipos-pagamento?${params.toString()}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar dados de tipos de pagamento:', error);
      return [];
    }
  }

  /**
   * Retorna a quantidade de transações por unidade/filial
   */
  async getTransacoesPorUnidade(
    filter: DashboardFilterRequestDto = {}
  ): Promise<DashboardUnidadeTransacaoResponseDto[]> {
    const params = new URLSearchParams();
    
    if (filter.periodo) params.append('periodo', filter.periodo);
    if (filter.dataInicio) params.append('dataInicio', filter.dataInicio);
    if (filter.dataFim) params.append('dataFim', filter.dataFim);
    if (filter.filialId) params.append('filialId', filter.filialId);

    try {
      const response = await instanceApi.get(
        `${this.baseUrl}/transacoes-por-unidade?${params.toString()}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar dados de transações por unidade:', error);
      return [];
    }
  }

  /**
   * Retorna o faturamento e despesas mensais do ano
   */
  async getFaturamentoMensal(
    ano?: number,
    filialId?: string
  ): Promise<DashboardFaturamentoMensalResponseDto[]> {
    const params = new URLSearchParams();
    
    if (ano) params.append('ano', ano.toString());
    if (filialId) params.append('filialId', filialId);

    try {
      const response = await instanceApi.get(
        `${this.baseUrl}/faturamento-mensal?${params.toString()}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar dados de faturamento mensal:', error);
      return [];
    }
  }

  /**
   * Carrega todos os dados do dashboard de uma só vez
   */
  async carregarTodosDados(
    filter: DashboardFilterRequestDto = {}
  ): Promise<{
    pacientesAtivos: DashboardIndicatorResponse;
    agendamentosMarcados: DashboardPeriodResponse[];
    avaliacoesAgendadas: DashboardPeriodResponse[];
    avaliacoesExecutadas: DashboardIndicatorResponse;
    sessoesRealizadas: DashboardPeriodResponse[];
    sessoesCanceladas: DashboardCanceledSessionsResponse;
    sessoesMensais: DashboardMonthlyChartResponse;
    unidadesDistribuicao: DashboardUnitDistributionResponse[];
    servicosMaisAgendados: DashboardTopServicesResponse[];
    sessoesPorFisioterapeuta: DashboardPhysiotherapistSessionsResponse[];
    patologiasAgrupadas: DashboardPathologyResponseDto[];
  }> {
    const [
      pacientesAtivos,
      agendamentosMarcados,
      avaliacoesAgendadas,
      avaliacoesExecutadas,
      sessoesRealizadas,
      sessoesCanceladas,
      sessoesMensais,
      unidadesDistribuicao,
      servicosMaisAgendados,
      sessoesPorFisioterapeuta,
      patologiasAgrupadas,
    ] = await Promise.all([
      this.getPacientesAtivos(filter),
      this.getAgendamentosMarcados(filter),
      this.getAvaliacoesAgendadas(filter),
      this.getAvaliacoesExecutadas(filter),
      this.getSessoesRealizadas(filter),
      this.getSessoesCanceladas({ ...filter, periodo: 'dia' }),
      this.getSessoesMensais(filter),
      this.getUnidadesDistribuicao(filter),
      this.getServicosMaisAgendados(filter),
      this.getSessoesPorFisioterapeuta(filter),
      this.getPatologiasAgrupadas(filter),
    ]);

    return {
      pacientesAtivos,
      agendamentosMarcados,
      avaliacoesAgendadas,
      avaliacoesExecutadas,
      sessoesRealizadas,
      sessoesCanceladas,
      sessoesMensais,
      unidadesDistribuicao,
      servicosMaisAgendados,
      sessoesPorFisioterapeuta,
      patologiasAgrupadas,
    };
  }

  /**
   * Retorna a comparação de faturamento entre o ano anterior e o ano atual
   */
  async getFaturamentoComparativo(params: { filialId?: string } = {}): Promise<DashboardFaturamentoComparativoResponseDto> {
    try {
      const urlParams = new URLSearchParams();
      
      if (params.filialId) {
        urlParams.append('filialId', params.filialId);
      }

      const queryString = urlParams.toString();
      const url = `${this.baseUrl}/faturamento-comparativo${queryString ? `?${queryString}` : ''}`;
      
      const response = await instanceApi.get<DashboardFaturamentoComparativoResponseDto>(url);
      
      if (response.status === 204) {
        return {
          series: [],
          categories: []
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar faturamento comparativo:', error);
      throw new Error('Falha ao carregar dados de faturamento comparativo');
    }
  }

  /**
   * Retorna o faturamento agrupado por categoria de serviço
   */
  async getFaturamentoPorCategoriaServico(
    params: DashboardFilterRequestDto = {}
  ): Promise<DashboardServicoReceitaResponseDto[]> {
    try {
      const urlParams = new URLSearchParams();
      
      if (params.periodo) {
        urlParams.append('periodo', params.periodo);
      }
      
      if (params.dataInicio) {
        urlParams.append('dataInicio', params.dataInicio);
      }
      
      if (params.dataFim) {
        urlParams.append('dataFim', params.dataFim);
      }
      
      if (params.filialId) {
        urlParams.append('filialId', params.filialId);
      }

      const queryString = urlParams.toString();
      const url = `${this.baseUrl}/faturamento-por-categoria-servico${queryString ? `?${queryString}` : ''}`;
      
      const response = await instanceApi.get<DashboardServicoReceitaResponseDto[]>(url);
      
      if (response.status === 204) {
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar faturamento por categoria de serviço:', error);
      throw new Error('Falha ao carregar dados de faturamento por categoria de serviço');
    }
  }
}

export default new DashboardService();
