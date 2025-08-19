import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import { DashboardFaturamentoComparativoResponseDto } from '../services/model/dashboard.types';

interface UseFaturamentoComparativoParams {
  filialId?: string;
}

export const useFaturamentoComparativo = (params: UseFaturamentoComparativoParams = {}) => {
  const [data, setData] = useState<DashboardFaturamentoComparativoResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DashboardService.getFaturamentoComparativo(params);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.filialId]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
