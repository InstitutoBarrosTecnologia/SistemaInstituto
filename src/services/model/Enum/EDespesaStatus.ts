/**
 * Status das despesas/receitas
 */
export enum EDespesaStatus {
    /**
     * Pendente de aprovação
     */
    Pendente = 1,

    /**
     * Aprovada e ativa
     */
    Aprovada = 2,

    /**
     * Cancelada
     */
    Cancelada = 3,

    /**
     * Concluída/Paga
     */
    Concluida = 4
}

/**
 * Mapeia os valores do enum para labels legíveis
 */
export const EDespesaStatusLabels: Record<EDespesaStatus, string> = {
    [EDespesaStatus.Pendente]: "Pendente",
    [EDespesaStatus.Aprovada]: "Aprovada",
    [EDespesaStatus.Cancelada]: "Cancelada",
    [EDespesaStatus.Concluida]: "Concluída"
};

/**
 * Obtém o label de um status de despesa
 */
export const getDespesaStatusLabel = (status: EDespesaStatus): string => {
    return EDespesaStatusLabels[status] || "Indefinido";
};
