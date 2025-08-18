import { ETipoTransacao } from "../model/Enum/ETipoTransacao";
import { EDespesaStatus } from "../model/Enum/EDespesaStatus";
import { EStatusParcela } from "../model/Enum/EStatusParcela";

/**
 * Utilitários para conversão e mapeamento de transações financeiras
 */
export class FinancialTransactionUtils {
    /**
     * Converte tipo de transação do frontend (string) para enum do backend
     */
    static convertTipoTransacao(tipo: "despesa" | "recebimento"): ETipoTransacao {
        return tipo === "recebimento" ? ETipoTransacao.Recebimento : ETipoTransacao.Despesa;
    }

    /**
     * Converte enum do backend para string do frontend
     */
    static convertTipoTransacaoToString(tipo: ETipoTransacao): "despesa" | "recebimento" {
        return tipo === ETipoTransacao.Recebimento ? "recebimento" : "despesa";
    }

    /**
     * Converte status de parcela do frontend (string) para enum do backend
     */
    static convertStatusParcela(status: "pago" | "pendente" | "vencido"): EStatusParcela {
        switch (status) {
            case "pago":
                return EStatusParcela.Paga;
            case "vencido":
                return EStatusParcela.Vencida;
            case "pendente":
            default:
                return EStatusParcela.Pendente;
        }
    }

    /**
     * Converte enum do backend para string do frontend
     */
    static convertStatusParcelaToString(status: EStatusParcela): "pago" | "pendente" | "vencido" {
        switch (status) {
            case EStatusParcela.Paga:
                return "pago";
            case EStatusParcela.Vencida:
                return "vencido";
            case EStatusParcela.Pendente:
            default:
                return "pendente";
        }
    }

    /**
     * Converte status de despesa do enum antigo para o novo
     */
    static convertDespesaStatus(status: number): EDespesaStatus {
        // Mapeia os valores antigos para os novos
        switch (status) {
            case 1: // Análise -> Pendente
                return EDespesaStatus.Pendente;
            case 2: // Aprovado -> Aprovada
                return EDespesaStatus.Aprovada;
            case 3: // Recusado -> Cancelada
                return EDespesaStatus.Cancelada;
            case 4: // Concluído -> Concluída
                return EDespesaStatus.Concluida;
            default:
                return EDespesaStatus.Pendente;
        }
    }

    /**
     * Converte enum do backend para número (compatibilidade com código anterior)
     */
    static convertDespesaStatusToNumber(status: EDespesaStatus): number {
        switch (status) {
            case EDespesaStatus.Pendente:
                return 1;
            case EDespesaStatus.Aprovada:
                return 2;
            case EDespesaStatus.Cancelada:
                return 3;
            case EDespesaStatus.Concluida:
                return 4;
            default:
                return 1;
        }
    }

    /**
     * Formata valor monetário para exibição
     */
    static formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    /**
     * Formata data para envio na API (ISO string)
     */
    static formatDateForApi(date: Date | string): string {
        if (typeof date === 'string') {
            return new Date(date).toISOString();
        }
        return date.toISOString();
    }

    /**
     * Formata data para exibição no frontend (dd/MM/yyyy)
     */
    static formatDateForDisplay(dateString: string): string {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    /**
     * Calcula status da parcela baseado na data de vencimento
     */
    static calculateParcelaStatus(dataVencimento: string, paga: boolean): "pago" | "pendente" | "vencido" {
        if (paga) return "pago";
        
        const today = new Date();
        const vencimento = new Date(dataVencimento);
        
        return vencimento < today ? "vencido" : "pendente";
    }

    /**
     * Valida se uma transação possui parcelas válidas
     */
    static validateParcelas(numeroParcelas?: number, dataVencimento?: string): boolean {
        if (!numeroParcelas || numeroParcelas < 1) return false;
        if (!dataVencimento) return false;
        
        const vencimento = new Date(dataVencimento);
        return !isNaN(vencimento.getTime());
    }
}
