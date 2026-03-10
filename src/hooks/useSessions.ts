import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSessionsAsync, deleteSessionAsync } from '../services/service/SessionService';
import toast from 'react-hot-toast';

export const useSessions = (clienteId?: string) => {
  const queryClient = useQueryClient();

  // Query para listar sessões
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions', clienteId],
    queryFn: () => getAllSessionsAsync(clienteId),
    staleTime: 1000 * 60 * 5, // 5 minutos
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
