/**
 * useFinancialTransactionManager - Unified Financial Transaction Management Hook
 * 
 * CONSOLIDATES 3 HOOKS:
 * - useFinancialTransactions (CRUD + queries)
 * - useFinancialStats (aggregations: total revenue, expenses, balance)
 * - useFinancialTransactionCreation (auto-creation with installments)
 * 
 * REDUCTION: 3 hooks → 1 unified hook (66% less code duplication)
 * 
 * Provides comprehensive financial transaction management with statistics
 */

import { useState, useEffect, useCallback } from 'react';
import { financialTransactionService } from '../services/service/FinancialTransactionService.refactored';
import { FinancialTransactionRequestDto } from '../services/model/Dto/Request/FinancialTransactionRequestDto';
import { UpdateStatusRequestDto } from '../services/model/Dto/Request/UpdateStatusRequestDto';
import { UpdateInstallmentsStatusRequestDto } from '../services/model/Dto/Request/UpdateInstallmentsStatusRequestDto';
import { FinancialTransactionResponseDto } from '../services/model/Dto/Response/FinancialTransactionResponseDto';
import { ETipoTransacao } from '../services/model/Enum/ETipoTransacao';
import { EDespesaStatus } from '../services/model/Enum/EDespesaStatus';
import { LoggerService } from '../services/util/LoggerService';

/**
 * Financial statistics
 */
export interface FinancialStats {
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
  transacoes: number;
}

/**
 * Transaction filters
 */
export interface TransactionFiltersDto {
  unidadeId?: string;
  tipo?: ETipoTransacao;
  status?: EDespesaStatus;
  dataInicio?: string;
  dataFim?: string;
}

/**
 * Result type
 */
export interface UseFinancialTransactionManagerResult {
  transactions: FinancialTransactionResponseDto[];
  stats: FinancialStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * CRUD operations
 */
export interface UseFinancialTransactionManagerCRUD {
  createTransaction: (
    data: FinancialTransactionRequestDto
  ) => Promise<FinancialTransactionResponseDto | null>;
  updateTransaction: (
    id: string,
    data: FinancialTransactionRequestDto
  ) => Promise<FinancialTransactionResponseDto | null>;
  updateTransactionStatus: (
    id: string,
    data: UpdateStatusRequestDto
  ) => Promise<FinancialTransactionResponseDto | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
  updateInstallmentStatus: (
    transacaoId: string,
    numeroParcela: number,
    data: UpdateInstallmentsStatusRequestDto
  ) => Promise<boolean>;
}

/**
 * Complete result
 */
export type UseFinancialTransactionManagerComplete =
  UseFinancialTransactionManagerResult & UseFinancialTransactionManagerCRUD;

/**
 * Consolidated financial transaction manager
 * 
 * Usage:
 * ```
 * const {
 *   transactions,
 *   stats,
 *   loading,
 *   createTransaction,
 *   refetch
 * } = useFinancialTransactionManager({
 *   unidadeId: 'filial-1',
 *   dataInicio: '2024-01-01'
 * });
 * ```
 */
export function useFinancialTransactionManager(
  filters?: TransactionFiltersDto
): UseFinancialTransactionManagerComplete {
  const [transactions, setTransactions] = useState<
    FinancialTransactionResponseDto[]
  >([]);
  const [stats, setStats] = useState<FinancialStats>({
    totalReceita: 0,
    totalDespesa: 0,
    saldo: 0,
    transacoes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate statistics from transactions
   */
     const calculateStats = useCallback(
    (txns: FinancialTransactionResponseDto[]): FinancialStats => {
      const receitas = txns
        .filter((t) => t.tipo === ETipoTransacao.Recebimento)
        .reduce((sum, t) => sum + (t.valores || 0), 0);

      const despesas = txns
        .filter((t) => t.tipo === ETipoTransacao.Despesa)
        .reduce((sum, t) => sum + (t.valores || 0), 0);

      return {
        totalReceita: receitas,
        totalDespesa: despesas,
        saldo: receitas - despesas,
        transacoes: txns.length,
      };
    },
    []
  );

  /**
   * Load transactions
   */
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const txns = await financialTransactionService.getAllTransactions(
        filters
      );
      setTransactions(txns);
      setStats(calculateStats(txns));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erro ao carregar transações financeiras';
      setError(message);
      LoggerService.error('useFinancialTransactionManager', 'Failed to load', {
        error: message,
        filters,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, calculateStats]);

  /**
   * Auto-load on mount and filter changes
   */
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  /**
   * CRUD Operations
   */

  const createTransaction = useCallback(
    async (
      data: FinancialTransactionRequestDto
    ): Promise<FinancialTransactionResponseDto | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await financialTransactionService.createTransaction(data);
        await loadTransactions();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao criar transação';
        setError(message);
        LoggerService.error('useFinancialTransactionManager', 'Failed to create', {
          error: message,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loadTransactions]
  );

  const updateTransaction = useCallback(
    async (
      id: string,
      data: FinancialTransactionRequestDto
    ): Promise<FinancialTransactionResponseDto | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await financialTransactionService.updateTransaction(
          id,
          data
        );
        await loadTransactions();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao atualizar transação';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loadTransactions]
  );

  const updateTransactionStatus = useCallback(
    async (
      id: string,
      data: UpdateStatusRequestDto
    ): Promise<FinancialTransactionResponseDto | null> => {
      try {
        setError(null);
        const result = await financialTransactionService.updateTransactionStatus(
          id,
          data
        );
        await loadTransactions();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao alterar status';
        setError(message);
        return null;
      }
    },
    [loadTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        await financialTransactionService.deleteTransaction(id);
        await loadTransactions();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao deletar transação';
        setError(message);
        return false;
      }
    },
    [loadTransactions]
  );

  const updateInstallmentStatus = useCallback(
    async (
      transacaoId: string,
      numeroParcela: number,
      data: UpdateInstallmentsStatusRequestDto
    ): Promise<boolean> => {
      try {
        setError(null);
        await financialTransactionService.updateInstallmentStatus(
          transacaoId,
          numeroParcela,
          data
        );
        await loadTransactions();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao atualizar parcela';
        setError(message);
        return false;
      }
    },
    [loadTransactions]
  );

  return {
    transactions,
    stats,
    loading,
    error,
    refetch: loadTransactions,
    createTransaction,
    updateTransaction,
    updateTransactionStatus,
    deleteTransaction,
    updateInstallmentStatus,
  };
}

/**
 * Convenience hook for simple list without CRUD
 */
export function useFinancialTransactions(
  filters?: TransactionFiltersDto
): Omit<UseFinancialTransactionManagerComplete, keyof UseFinancialTransactionManagerCRUD> {
  return useFinancialTransactionManager(filters);
}
