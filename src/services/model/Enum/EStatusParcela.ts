/**
 * Status das parcelas
 */
export enum EStatusParcela {
    /**
     * Parcela pendente de pagamento
     */
    Pendente = 1,

    /**
     * Parcela paga
     */
    Paga = 2,

    /**
     * Parcela vencida
     */
    Vencida = 3,

    /**
     * Parcela cancelada
     */
    Cancelada = 4
}

/**
 * Mapeia os valores do enum para labels legíveis
 */
export const EStatusParcelaLabels: Record<EStatusParcela, string> = {
    [EStatusParcela.Pendente]: "Pendente",
    [EStatusParcela.Paga]: "Paga",
    [EStatusParcela.Vencida]: "Vencida",
    [EStatusParcela.Cancelada]: "Cancelada"
};

/**
 * Obtém o label de um status de parcela
 */
export const getStatusParcelaLabel = (status: EStatusParcela): string => {
    return EStatusParcelaLabels[status] || "Indefinido";
};
