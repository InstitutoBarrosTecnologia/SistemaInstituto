import { BaseResponseDto } from "./BaseResponseDto";
import { BranchOfficeResponseDto } from "./BranchOfficeResponseDto";

export interface DespesaResponseDto extends BaseResponseDto {
  nomeDespesa: string;
  descricao?: string;
  unidadeId: string;
  unidade?: BranchOfficeResponseDto;
  quantidade: number;
  status: EDespesaStatus;
  arquivo?: string;
  observacoes?: string;
  nomeUnidade?: string;
}

export enum EDespesaStatus {
  Analise = 0,
  Aprovado = 1,
  Recusado = 2
}

export const getDespesaStatusLabel = (status: EDespesaStatus): string => {
  switch (status) {
    case EDespesaStatus.Aprovado:
      return "Aprovado";
    case EDespesaStatus.Analise:
      return "Análise";
    case EDespesaStatus.Recusado:
      return "Recusado";
    default:
      return "Análise";
  }
};

export const getDespesaStatusColor = (status: EDespesaStatus): string => {
  switch (status) {
    case EDespesaStatus.Aprovado:
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    case EDespesaStatus.Analise:
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    case EDespesaStatus.Recusado:
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
    default:
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
  }
};
