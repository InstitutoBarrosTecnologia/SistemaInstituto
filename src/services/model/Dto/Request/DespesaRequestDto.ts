import { BaseRequestDto } from "./BaseRequestDto";

export interface DespesaRequestDto extends BaseRequestDto {
  nomeDespesa: string;
  descricao?: string;
  unidadeId: string;
  quantidade: number;
  status: EDespesaStatus;
  arquivo?: string; // URL do arquivo após upload
  observacoes?: string;
}

export enum EDespesaStatus {
  Analise = 0,
  Aprovado = 1,
  Recusado = 2
}
