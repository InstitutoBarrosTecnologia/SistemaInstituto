import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSessionsAsync, deleteSessionAsync, SessionFilters } from '../services/service/SessionService';
import toast from 'react-hot-toast';

interface UseSessionsOptions {
  clienteId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export const useSessions = (options?: string | UseSessionsOptions) => {
  const queryClient = useQueryClient();

  // suporte retroativo: string = clienteId direto
  const filters: SessionFilters = typeof options === 'string'
    ? { clienteId: options }
    : { ...options };

  // Query para listar sessões
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => getAllSessionsAsync(filters),
    staleTime: 0, // sem cache — dados de check-in devem ser sempre frescos
  });

  // Mutation para deletar sessão
  const deleteMutation = useMutation({
    mutationFn: deleteSessionAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Check-in excluído com sucesso!');
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('Você não tem permissão para excluir check-ins');
      } else if (error.response?.status === 404) {
        toast.error('Check-in não encontrado');
        queryClient.invalidateQueries({ queryKey: ['sessions'] });
      } else {
        toast.error('Erro ao excluir check-in. Tente novamente.');
      }
    },
  });

  return {
    sessions: data || [],
    isLoading,
    error,
    refetch,
    deleteSession: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
