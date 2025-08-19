import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import { DashboardFilterRequestDto, DashboardUnidadeTransacaoResponseDto } from '../services/model/dashboard.types';

interface UseTransacoesPorUnidadeResult {
  data: DashboardUnidadeTransacaoResponseDto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTransacoesPorUnidade(filters: DashboardFilterRequestDto = {}): UseTransacoesPorUnidadeResult {
  const [data, setData] = useState<DashboardUnidadeTransacaoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await DashboardService.getTransacoesPorUnidade(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de transações por unidade');
      console.error('Erro ao buscar dados de transações por unidade:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    filters.periodo,
    filters.dataInicio, 
    filters.dataFim,
    filters.filialId
  ]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}
