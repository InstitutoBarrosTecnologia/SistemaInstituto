import { useMemo } from 'react';
import { useFinancialTransactions } from './useFinancialTransactions';
import { 
    ETipoTransacao, 
    EDespesaStatus,
    TransactionFilters
} from '../services/financialTransactions';

export interface FinancialStats {
    receitasMes: number;
    despesasMes: number;
    saldoLiquido: number;
    pendentes: number;
    totalTransacoes: number;
    receitasAprovadas: number;
    despesasAprovadas: number;
    aprovadoNoFiltro: number;
    concluidoNoFiltro: number;
    isLoading: boolean;
}

export function useFinancialStats(filters?: TransactionFilters): FinancialStats {
    const { transactions, isLoading } = useFinancialTransactions(filters);

    const stats = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return {
                receitasMes: 0,
                despesasMes: 0,
                saldoLiquido: 0,
                pendentes: 0,
                totalTransacoes: 0,
                receitasAprovadas: 0,
                despesasAprovadas: 0,
                aprovadoNoFiltro: 0,
                concluidoNoFiltro: 0,
            };
        }

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Filtrar transações do mês atual (para cards históricos sem filtro de data)
        const transacoesDoMes = transactions.filter(transaction => {
            if (!transaction.dataCadastro) return false;
            const transactionDate = new Date(transaction.dataCadastro);
            return transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
        });

        // Receitas do mês (Aprovada ou Concluída)
        const receitasMes = transacoesDoMes
            .filter(t => t.tipo === ETipoTransacao.Recebimento && (t.status === EDespesaStatus.Aprovada || t.status === EDespesaStatus.Concluida))
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Despesas do mês (Aprovada ou Concluída)
        const despesasMes = transacoesDoMes
            .filter(t => t.tipo === ETipoTransacao.Despesa && (t.status === EDespesaStatus.Aprovada || t.status === EDespesaStatus.Concluida))
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Saldo líquido
        const saldoLiquido = receitasMes - despesasMes;

        // Pendentes (dentro do período filtrado)
        const pendentes = transactions
            .filter(t => t.status === EDespesaStatus.Pendente)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Total de transações
        const totalTransacoes = transactions.length;

        // Receitas aprovadas
        const receitasAprovadas = transactions
            .filter(t => t.tipo === ETipoTransacao.Recebimento && t.status === EDespesaStatus.Aprovada)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Despesas aprovadas
        const despesasAprovadas = transactions
            .filter(t => t.tipo === ETipoTransacao.Despesa && t.status === EDespesaStatus.Aprovada)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Total aprovado no período filtrado (apenas Recebimentos com status Aprovada)
        const aprovadoNoFiltro = transactions
            .filter(t => t.tipo === ETipoTransacao.Recebimento && t.status === EDespesaStatus.Aprovada)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Total concluído no período filtrado (apenas Recebimentos com status Concluída)
        const concluidoNoFiltro = transactions
            .filter(t => t.tipo === ETipoTransacao.Recebimento && t.status === EDespesaStatus.Concluida)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        return {
            receitasMes,
            despesasMes,
            saldoLiquido,
            pendentes,
            totalTransacoes,
            receitasAprovadas,
            despesasAprovadas,
            aprovadoNoFiltro,
            concluidoNoFiltro,
        };
    }, [transactions]);

    return {
        ...stats,
        isLoading
    };
}
