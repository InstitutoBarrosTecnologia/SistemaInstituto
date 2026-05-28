/**
 * DTO leve para listagens de seleção (ex: filtros do calendário).
 * Retorna apenas id e nome — sem dados completos do cliente.
 */
export interface CustomerSummaryResponseDto {
  id: string;
  nome: string;
  nrTelefone?: string;
}
