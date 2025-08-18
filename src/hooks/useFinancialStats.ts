import { useMemo } from 'react';
import { useFinancialTransactions } from './useFinancialTransactions';
import { 
    ETipoTransacao, 
    EDespesaStatus
} from '../services/financialTransactions';

export interface FinancialStats {
    receitasMes: number;
    despesasMes: number;
    saldoLiquido: number;
    pendentes: number;
    totalTransacoes: number;
    receitasAprovadas: number;
    despesasAprovadas: number;
    isLoading: boolean;
}

export function useFinancialStats(): FinancialStats {
    const { transactions, isLoading } = useFinancialTransactions();

    const stats = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return {
                receitasMes: 0,
                despesasMes: 0,
                saldoLiquido: 0,
                pendentes: 0,
                totalTransacoes: 0,
                receitasAprovadas: 0,
                despesasAprovadas: 0
            };
        }

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Filtrar transações do mês atual
        const transacoesDoMes = transactions.filter(transaction => {
            if (!transaction.dataCadastro) return false;
            
            const transactionDate = new Date(transaction.dataCadastro);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });

        // Calcular receitas do mês (tipo = recebimento)
        const receitasMes = transacoesDoMes
            .filter(t => t.tipo === ETipoTransacao.Recebimento)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Calcular despesas do mês (tipo = despesa)
        const despesasMes = transacoesDoMes
            .filter(t => t.tipo === ETipoTransacao.Despesa)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Calcular saldo líquido
        const saldoLiquido = receitasMes - despesasMes;

        // Calcular pendentes (status = pendente, independente do mês)
        const pendentes = transactions
            .filter(t => t.status === EDespesaStatus.Pendente)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Calcular total de transações
        const totalTransacoes = transactions.length;

        // Calcular receitas aprovadas (tipo = recebimento e status = aprovada)
        const receitasAprovadas = transactions
            .filter(t => t.tipo === ETipoTransacao.Recebimento && t.status === EDespesaStatus.Aprovada)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        // Calcular despesas aprovadas (tipo = despesa e status = aprovada)
        const despesasAprovadas = transactions
            .filter(t => t.tipo === ETipoTransacao.Despesa && t.status === EDespesaStatus.Aprovada)
            .reduce((sum, t) => sum + (t.valores || 0), 0);

        return {
            receitasMes,
            despesasMes,
            saldoLiquido,
            pendentes,
            totalTransacoes,
            receitasAprovadas,
            despesasAprovadas
        };
    }, [transactions]);

    return {
        ...stats,
        isLoading
    };
}
