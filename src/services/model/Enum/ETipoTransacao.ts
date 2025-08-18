/**
 * Tipos de transação financeira
 */
export enum ETipoTransacao {
    /**
     * Despesa/Saída de dinheiro
     */
    Despesa = 1,

    /**
     * Receita/Entrada de dinheiro
     */
    Recebimento = 2
}

/**
 * Mapeia os valores do enum para labels legíveis
 */
export const ETipoTransacaoLabels: Record<ETipoTransacao, string> = {
    [ETipoTransacao.Despesa]: "Despesa",
    [ETipoTransacao.Recebimento]: "Recebimento"
};

/**
 * Obtém o label de um tipo de transação
 */
export const getTipoTransacaoLabel = (tipo: ETipoTransacao): string => {
    return ETipoTransacaoLabels[tipo] || "Indefinido";
};
