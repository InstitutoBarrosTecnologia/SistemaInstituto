/**
 * WhatsappNumberResponseDto
 * Espelhado de WhatsappNumberResponseDto.cs
 */
export interface WhatsappNumberResponseDto {
  id: string;
  nomeInstancia: string;
  numero: string;
  filialId: string;
  ativo: boolean;
  /** true = conectado (UltimaConexao nos últimos 5 minutos) */
  conectado: boolean;
  ultimaConexao?: string;
  dataCadastro: string;
}

/**
 * WhatsappConversationResponseDto
 * Espelhado de WhatsappConversationResponseDto.cs
 */
export interface WhatsappConversationResponseDto {
  id: string;
  whatsappNumberId: string;
  nrTelefoneCliente: string;
  nomeContato?: string;
  customerId?: string;
  nomeCliente?: string;
  status: number;
  statusDescricao: string;
  tipoAtendimento: number;
  tipoAtendimentoDescricao: string;
  esteiraBot?: string;
  mensagensNaoLidas: number;
  ultimaAtividade: string;
  ultimaMensagemPreview?: string;
  dataCadastro: string;
}

/**
 * WhatsappMessageResponseDto
 * Espelhado de WhatsappMessageResponseDto.cs
 */
export interface WhatsappMessageResponseDto {
  id: string;
  whatsappConversationId: string;
  messageId: string;
  conteudo: string;
  tipoMidia?: string;
  urlMidia?: string;
  enviadaPelaClinica: boolean;
  statusMensagem: number;
  dataMensagem: string;
}
