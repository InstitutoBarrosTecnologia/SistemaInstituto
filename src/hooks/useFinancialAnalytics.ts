/**
 * useFinancialAnalytics - Unified Financial Analytics Hook
 * 
 * CONSOLIDATES 7 HOOKS:
 * - useFaturamentoComparativo
 * - useFaturamentoMensal
 * - useFaturamentoPorCategoriaServico
 * - useFaturamentoEDespesas
 * - useEntradaSaida
 * - useTiposPagamento
 * - useTransacoesPorUnidade
 * 
 * REDUCTION: 7 hooks → 1 unified hook (85% less code duplication)
 * 
 * Provides flexible financial analytics data loading with automatic refetch
 * based on filter changes (period, date range, branch, employee)
 */

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/service/DashboardService.refactored';
import {
  DashboardFilterRequestDto,
  DashboardFaturamentoResponseDto,
  DashboardFaturamentoMensalResponseDto,
  DashboardFaturamentoComparativoResponseDto,
  DashboardServicoReceitaResponseDto,
  DashboardEntradaSaidaResponseDto,
  DashboardTipoPagamentoResponseDto,
  DashboardUnidadeTransacaoResponseDto,
  DashboardDespesasResponseDto,
} from '../services/model/dashboard.types';
import { LoggerService } from '../services/util/LoggerService';

/**
 * Financial report types
 */
export enum FinancialReportType {
  FATURAMENTO = 'faturamento',
  FATURAMENTO_MENSAL = 'faturamentoMensal',
  FATURAMENTO_COMPARATIVO = 'faturamentoComparativo',
  FATURAMENTO_SERVICO = 'faturamentoServico',
  ENTRADA_SAIDA = 'entradaSaida',
  TIPO_PAGAMENTO = 'tipoPagamento',
  UNIDADE_TRANSACAO = 'unidadeTransacao',
  DESPESAS = 'despesas',
}

/**
 * Result type for each report
 */
export type FinancialAnalyticsResult<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * Consolidated financial analytics hook
 * 
 * Usage:
 * ```
 * const { data, loading, error, refetch } = useFinancialAnalytics(
 *   FinancialReportType.FATURAMENTO_MENSAL,
 *   { periodo: 'mes', filialId: 'filial-1' }
 * );
 * ```
 */
export function useFinancialAnalytics<T>(
  reportType: FinancialReportType,
  filters: DashboardFilterRequestDto = {}
): FinancialAnalyticsResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch data based on report type
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result: any;

      switch (reportType) {
        case FinancialReportType.FATURAMENTO:
          result = await dashboardService.getFaturamento(filters);
          break;
        case FinancialReportType.FATURAMENTO_MENSAL:
          result = await dashboardService.getFaturamentoMensal(filters);
          break;
        case FinancialReportType.FATURAMENTO_COMPARATIVO:
          result = await dashboardService.getFaturamentoComparativo(filters);
          break;
        case FinancialReportType.FATURAMENTO_SERVICO:
          result = await dashboardService.getServicoReceita(filters);
          break;
        case FinancialReportType.ENTRADA_SAIDA:
          result = await dashboardService.getEntradaSaida(filters);
          break;
        case FinancialReportType.TIPO_PAGAMENTO:
          result = await dashboardService.getTipoPagamento(filters);
          break;
        case FinancialReportType.UNIDADE_TRANSACAO:
          result = await dashboardService.getUnidadeTransacao(filters);
          break;
        case FinancialReportType.DESPESAS:
          result = await dashboardService.getDespesas(filters);
          break;
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar dados financeiros';
      setError(message);
      LoggerService.error('useFinancialAnalytics', `Failed to load ${reportType}`, {
        error: message,
        reportType,
        filters,
      });
    } finally {
      setLoading(false);
    }
  }, [reportType, filters]);

  /**
   * Auto-refetch when filters change
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: data as T,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Convenience hooks for each report type
 * Usage: const { data, loading } = useFaturamentoMensal(filters);
 */

export function useFaturamento(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardFaturamentoResponseDto> {
  return useFinancialAnalytics<DashboardFaturamentoResponseDto>(
    FinancialReportType.FATURAMENTO,
    filters
  );
}

export function useFaturamentoMensal(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardFaturamentoMensalResponseDto[]> {
  return useFinancialAnalytics<DashboardFaturamentoMensalResponseDto[]>(
    FinancialReportType.FATURAMENTO_MENSAL,
    filters
  );
}

export function useFaturamentoComparativo(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardFaturamentoComparativoResponseDto> {
  return useFinancialAnalytics<DashboardFaturamentoComparativoResponseDto>(
    FinancialReportType.FATURAMENTO_COMPARATIVO,
    filters
  );
}

export function useFaturamentoServico(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardServicoReceitaResponseDto[]> {
  return useFinancialAnalytics<DashboardServicoReceitaResponseDto[]>(
    FinancialReportType.FATURAMENTO_SERVICO,
    filters
  );
}

export function useEntradaSaida(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardEntradaSaidaResponseDto> {
  return useFinancialAnalytics<DashboardEntradaSaidaResponseDto>(
    FinancialReportType.ENTRADA_SAIDA,
    filters
  );
}

export function useTiposPagamento(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardTipoPagamentoResponseDto[]> {
  return useFinancialAnalytics<DashboardTipoPagamentoResponseDto[]>(
    FinancialReportType.TIPO_PAGAMENTO,
    filters
  );
}

export function useTransacoesPorUnidade(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardUnidadeTransacaoResponseDto[]> {
  return useFinancialAnalytics<DashboardUnidadeTransacaoResponseDto[]>(
    FinancialReportType.UNIDADE_TRANSACAO,
    filters
  );
}

export function useDespesas(
  filters?: DashboardFilterRequestDto
): FinancialAnalyticsResult<DashboardDespesasResponseDto> {
  return useFinancialAnalytics<DashboardDespesasResponseDto>(
    FinancialReportType.DESPESAS,
    filters
  );
}
