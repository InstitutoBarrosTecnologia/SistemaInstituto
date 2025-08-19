import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import {
  DashboardFilterRequestDto,
  DashboardFaturamentoResponseDto,
  DashboardDespesasResponseDto,
} from '../services/model/dashboard.types';

// Hook para dados de faturamento
export function useFaturamento(filter: DashboardFilterRequestDto = {}) {
  const [data, setData] = useState<DashboardFaturamentoResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaturamento = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DashboardService.getFaturamento(filter);
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar faturamento:', err);
      setError('Erro ao carregar dados de faturamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaturamento();
  }, [
    filter.periodo,
    filter.dataInicio,
    filter.dataFim,
    filter.filialId,
  ]);

  return {
    data,
    loading,
    error,
    refetch: fetchFaturamento,
  };
}

// Hook para dados de despesas
export function useDespesas(filter: DashboardFilterRequestDto = {}) {
  const [data, setData] = useState<DashboardDespesasResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDespesas = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DashboardService.getDespesas(filter);
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
      setError('Erro ao carregar dados de despesas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, [
    filter.periodo,
    filter.dataInicio,
    filter.dataFim,
    filter.filialId,
  ]);

  return {
    data,
    loading,
    error,
    refetch: fetchDespesas,
  };
}

// Hook combinado para ambos os dados
export function useFaturamentoEDespesas(filter: DashboardFilterRequestDto = {}) {
  const faturamento = useFaturamento(filter);
  const despesas = useDespesas(filter);

  return {
    faturamento,
    despesas,
    loading: faturamento.loading || despesas.loading,
    error: faturamento.error || despesas.error,
    refetchAll: () => {
      faturamento.refetch();
      despesas.refetch();
    },
  };
}
