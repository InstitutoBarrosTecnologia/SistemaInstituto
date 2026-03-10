/**
 * Form Order Service Hooks Index
 * 
 * Hooks customizados para FormOrderService.tsx
 * 
 * Exports:
 * - useFormOrderService - Hook principal para gerenciamento do formulário
 * - usePriceCalculations - Cálculos de preço, desconto e ganho
 * - useScheduleRecurrence - Gerenciamento de agendamentos recorrentes
 * - useFinancialTransactionCreation - Criação de transações financeiras
 */

export { useFormOrderService } from './useFormOrderService';
export { usePriceCalculations } from './usePriceCalculations';
export { useScheduleRecurrence } from './useScheduleRecurrence';
export { useFinancialTransactionCreation } from './useFinancialTransactionCreation';

// Re-export types
export type { FinancialTransactionService } from '../services/service/FinancialTransactionService';
