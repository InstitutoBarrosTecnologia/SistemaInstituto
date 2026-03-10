/**
 * useFinancialTransactionCreation - Hook para criar transações financeiras
 * 
 * Gerencia criação automática de transações quando ordem de serviço é criada
 * 
 * Responsabilidades:
 * - Calcular parcelas
 * - Criar registros financeiros
 * - Validar dados financeiros
 * - Gerenciar estado de transações
 */

import { useState, useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { LoggerService } from '../services/util/LoggerService';
import { FinancialTransactionService } from '../services/service/FinancialTransactionService';
import { FinancialTransactionRequestDto } from '../services/model/Dto/Request/FinancialTransactionRequestDto';
import { ETipoTransacao } from '../services/model/Enum/ETipoTransacao';

interface InstallmentConfig {
  numberOfInstallments: number;
  accountType: 'corrente' | 'poupanca'; // corrente, poupanca
  paymentDate: string;
}

interface TransactionData {
  orderId: string;
  amount: number;
  description: string;
  numberOfInstallments: number;
  accountType: 'corrente' | 'poupanca';
  paymentDate: string;
  installments: InstallmentConfig;
}

interface CalculatedInstallment {
  number: number;
  amount: number;
  dueDate: Date;
  description: string;
}

export function useFinancialTransactionCreation() {
  const [transactionData, setTransactionData] = useState<Partial<TransactionData>>({
    numberOfInstallments: 1,
    accountType: 'corrente',
    amount: 0,
    description: '',
    orderId: '',
    paymentDate: '',
    installments: {
      numberOfInstallments: 1,
      accountType: 'corrente',
      paymentDate: '',
    },
  });

  const [installments, setInstallments] = useState<CalculatedInstallment[]>([]);

  /**
   * Calcular datas de vencimento das parcelas
   */
  const calculateInstallmentDates = useCallback(
    (baseDate: string, numberOfInstallments: number): Date[] => {
      try {
        const dates: Date[] = [];
        const base = new Date(baseDate);

        for (let i = 0; i < numberOfInstallments; i++) {
          const dueDate = new Date(base);
          dueDate.setMonth(dueDate.getMonth() + i);
          dueDate.setDate(dueDate.getDate() + 5); // 5 dias após o mês
          dates.push(dueDate);
        }

        return dates;
      } catch (error) {
        LoggerService.error(
          'useFinancialTransactionCreation',
          'Error calculating installment dates',
          error
        );
        return [];
      }
    },
    []
  );

  /**
   * Calcular parcelas
   */
  const calculateInstallments = useCallback(
    (amount: number, count: number, description: string): CalculatedInstallment[] => {
      if (amount <= 0 || count <= 0) {
        return [];
      }

      const installmentAmount = amount / count;
      const baseDate = new Date().toISOString().split('T')[0];
      const dueDates = calculateInstallmentDates(baseDate, count);

      return dueDates.map((dueDate, index) => ({
        number: index + 1,
        amount: installmentAmount,
        dueDate,
        description: `${description} - Parcela ${index + 1}/${count}`,
      }));
    },
    [calculateInstallmentDates]
  );

  /**
   * Atualizar número de parcelas e recalcular
   */
  const updateNumberOfInstallments = useCallback(
    (count: number, amount?: number, description?: string) => {
      const finalAmount = amount ?? (transactionData.amount || 0);
      const finalDescription =
        description ?? (transactionData.description || 'Transação Financeira');

      if (finalAmount > 0 && count > 0) {
        const calculated = calculateInstallments(finalAmount, count, finalDescription);
        setInstallments(calculated);
      }

      setTransactionData((prev) => ({
        ...prev,
        numberOfInstallments: Math.max(1, count),
      }));
    },
    [transactionData, calculateInstallments]
  );

  /**
   * Atualizar tipo de conta
   */
  const updateAccountType = useCallback(
    (type: 'corrente' | 'poupanca') => {
      setTransactionData((prev) => ({
        ...prev,
        accountType: type,
      }));
    },
    []
  );

  /**
   * Atualizar data de pagamento
   */
  const updatePaymentDate = useCallback((date: string) => {
    setTransactionData((prev) => ({
      ...prev,
      paymentDate: date,
    }));
  }, []);

  /**
   * Validar dados financeiros
   */
  const isValid = useCallback((): boolean => {
    return (
      !!transactionData.orderId &&
      transactionData.amount! > 0 &&
      transactionData.numberOfInstallments! > 0 &&
      !!transactionData.accountType &&
      !!transactionData.paymentDate
    );
  }, [transactionData]);

  /**
   * Criar transações financeiras
   */
  const createTransactionsMutation = useMutation({
    mutationFn: async (installmentsToCreate: CalculatedInstallment[]) => {
      if (!transactionData.orderId) {
        throw new Error('Order ID é obrigatório');
      }

      if (installmentsToCreate.length === 0) {
        LoggerService.warn(
          'useFinancialTransactionCreation',
          'No installments to create'
        );
        return [];
      }

      const promises = installmentsToCreate.map((installment) => {
        const transaction: FinancialTransactionRequestDto = {
          nomeDespesa: installment.description,
          valores: installment.amount,
          tipo: ETipoTransacao.Recebimento,
          formaPagamento: 'PIX',
          conta: 'Principal',
          ordemServicoId: transactionData.orderId!,
          dataVencimento: installment.dueDate.toISOString().split('T')[0],
          descricao: `Parcela ${installment.number} de ${transactionData.numberOfInstallments}`,
          observacoes: `Parcela ${installment.number} de ${transactionData.numberOfInstallments}`,
        };

        return FinancialTransactionService.create(transaction);
      });

      return Promise.all(promises);
    },
    onSuccess: (created) => {
      LoggerService.info(
        'useFinancialTransactionCreation',
        `Created ${created.length} financial transactions`
      );
      toast.success(
        `${created.length} transação${created.length > 1 ? 's' : ''} criada${created.length > 1 ? 's' : ''}`
      );
    },
    onError: (error) => {
      LoggerService.error(
        'useFinancialTransactionCreation',
        'Failed to create financial transactions',
        error
      );
      toast.error('Erro ao criar transações financeiras');
    },
  });

  /**
   * Resumo financeiro
   */
  const summary = useMemo(() => {
    const totalAmount = transactionData.amount || 0;
    const count = transactionData.numberOfInstallments || 1;
    const installmentAmount = count > 0 ? totalAmount / count : 0;

    return {
      totalAmount,
      numberOfInstallments: count,
      installmentAmount,
      totalCalculated: installmentAmount * count,
      differenceRounding: totalAmount - installmentAmount * count,
    };
  }, [transactionData.amount, transactionData.numberOfInstallments]);

  /**
   * Resetar dados
   */
  const reset = useCallback(() => {
    setTransactionData({
      numberOfInstallments: 1,
      accountType: 'corrente',
      amount: 0,
      description: '',
      orderId: '',
      paymentDate: '',
      installments: {
        numberOfInstallments: 1,
        accountType: 'corrente',
        paymentDate: '',
      },
    });
    setInstallments([]);
  }, []);

  return {
    // Dados
    transactionData,
    installments,
    summary,

    // Atualizar
    updateNumberOfInstallments,
    updateAccountType,
    updatePaymentDate,
    setTransactionData,

    // Criar transações
    createTransactions: createTransactionsMutation.mutate,
    isCreatingTransactions: createTransactionsMutation.isPending,

    // Validação e utilitários
    isValid,
    reset,
    calculateInstallments,
    calculateInstallmentDates,
  };
}

export default useFinancialTransactionCreation;
