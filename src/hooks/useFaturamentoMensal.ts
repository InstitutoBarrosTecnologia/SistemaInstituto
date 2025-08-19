import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import { DashboardFaturamentoMensalResponseDto } from '../services/model/dashboard.types';

interface UseFaturamentoMensalResult {
  data: DashboardFaturamentoMensalResponseDto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFaturamentoMensal(ano?: number, filialId?: string): UseFaturamentoMensalResult {
  const [data, setData] = useState<DashboardFaturamentoMensalResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await DashboardService.getFaturamentoMensal(ano, filialId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de faturamento mensal');
      console.error('Erro ao buscar dados de faturamento mensal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ano, filialId]);

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
