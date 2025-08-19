import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import { DashboardFilterRequestDto, DashboardEntradaSaidaResponseDto } from '../services/model/dashboard.types';

interface UseEntradaSaidaResult {
  data: DashboardEntradaSaidaResponseDto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEntradaSaida(filters: DashboardFilterRequestDto = {}): UseEntradaSaidaResult {
  const [data, setData] = useState<DashboardEntradaSaidaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await DashboardService.getEntradaSaida(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de entrada e saída');
      console.error('Erro ao buscar dados de entrada e saída:', err);
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
