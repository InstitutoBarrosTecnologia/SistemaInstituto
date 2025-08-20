import { useState, useEffect } from 'react';
import DashboardService from '../services/service/DashboardService';
import { 
  DashboardFilterRequestDto, 
  DashboardServicoReceitaResponseDto 
} from '../services/model/dashboard.types';

export const useFaturamentoPorCategoriaServico = (filters: DashboardFilterRequestDto) => {
  const [data, setData] = useState<DashboardServicoReceitaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await DashboardService.getFaturamentoPorCategoriaServico(filters);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.periodo, filters.dataInicio, filters.dataFim, filters.filialId]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
