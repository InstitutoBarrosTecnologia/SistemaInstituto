import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import { DashboardFilterRequestDto, DashboardTipoPagamentoResponseDto } from '../services/model/dashboard.types';

interface UseTiposPagamentoResult {
  data: DashboardTipoPagamentoResponseDto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTiposPagamento(filters: DashboardFilterRequestDto = {}): UseTiposPagamentoResult {
  const [data, setData] = useState<DashboardTipoPagamentoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await DashboardService.getTiposPagamento(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de tipos de pagamento');
      console.error('Erro ao buscar dados de tipos de pagamento:', err);
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
