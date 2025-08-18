import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
    FinancialTransactionService, 
    FinancialTransactionRequestDto, 
    UpdateStatusRequestDto,
    TransactionFilters 
} from '../services/financialTransactions';

/**
 * Hook para gerenciar transações financeiras com React Query
 */
export const useFinancialTransactions = (filters?: TransactionFilters) => {
    const queryClient = useQueryClient();

    // Query para buscar todas as transações
    const {
        data: transactions = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['financial-transactions', filters],
        queryFn: () => FinancialTransactionService.getAll(filters),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 2
    });

    // Mutation para criar transação
    const createMutation = useMutation({
        mutationFn: (data: FinancialTransactionRequestDto) => 
            FinancialTransactionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
            toast.success('Transação criada com sucesso!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao criar transação');
        }
    });

    // Mutation para atualizar transação
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FinancialTransactionRequestDto }) =>
            FinancialTransactionService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
            toast.success('Transação atualizada com sucesso!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao atualizar transação');
        }
    });

    // Mutation para atualizar status
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStatusRequestDto }) =>
            FinancialTransactionService.updateStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
            toast.success('Status atualizado com sucesso!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao atualizar status');
        }
    });

    // Mutation para deletar transação
    const deleteMutation = useMutation({
        mutationFn: (id: string) => FinancialTransactionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
            toast.success('Transação excluída com sucesso!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao excluir transação');
        }
    });

    return {
        // Data
        transactions,
        isLoading,
        isError,
        error,
        
        // Actions
        refetch,
        createTransaction: createMutation.mutate,
        updateTransaction: updateMutation.mutate,
        updateTransactionStatus: updateStatusMutation.mutate,
        deleteTransaction: deleteMutation.mutate,
        
        // Mutation states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isUpdatingStatus: updateStatusMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
};

/**
 * Hook para buscar uma transação específica
 */
export const useFinancialTransaction = (id: string) => {
    return useQuery({
        queryKey: ['financial-transaction', id],
        queryFn: () => FinancialTransactionService.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 2
    });
};
