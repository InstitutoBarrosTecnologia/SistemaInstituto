// Tipos para o módulo WhatsApp - refletem os DTOs do backend

export interface WhatsappConversationResponseDto {
  id: string;
  whatsappNumberId: string;
  nrTelefoneCliente: string;
  nomeContato: string | null;
  customerId: string | null;
  nomeCliente: string | null;
  status: number;
  statusDescricao: string;
  tipoAtendimento: number;
  tipoAtendimentoDescricao: string;
  esteiraBot: string | null;
  mensagensNaoLidas: number;
  ultimaAtividade: string;
  ultimaMensagemPreview: string | null;
  dataCadastro: string;
}

export interface WhatsappMessageResponseDto {
  id: string;
  whatsappConversationId: string;
  messageId: string;
  conteudo: string;
  tipoMidia: string | null;
  urlMidia: string | null;
  enviadaPelaClinica: boolean;
  statusMensagem: number;
  dataMensagem: string;
}

export interface WhatsappNumberResponseDto {
  id: string;
  nomeInstancia: string;
  numero: string;
  filialId: string;
  ativo: boolean;
  ultimaConexao: string | null;
  conectado: boolean;
  dataCadastro: string;
}

export interface WhatsappNumberRequestDto {
  id?: string;
  nomeInstancia: string;
  numero: string;
  filialId: string;
  ativo: boolean;
  tokenInstancia?: string;
}

export enum WhatsappConversationStatus {
  Nova = 0,
  Ativa = 1,
  Finalizada = 2,
  Arquivada = 3,
}

export const statusLabel: Record<number, string> = {
  0: 'Nova',
  1: 'Ativa',
  2: 'Finalizada',
  3: 'Arquivada',
};

export const statusColor: Record<number, 'success' | 'info' | 'warning' | 'error' | 'light'> = {
  0: 'success',
  1: 'info',
  2: 'light',
  3: 'light',
};
