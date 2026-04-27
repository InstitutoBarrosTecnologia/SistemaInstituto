import { BaseRequestDto } from './BaseRequestDto';

/**
 * Payload para cadastro/atualização de número WhatsApp (instância).
 * Espelhado de WhatsappNumberRequestDto.cs
 */
export interface WhatsappNumberRequestDto extends BaseRequestDto {
  nomeInstancia: string;
  numero: string;
  filialId: string;
  ativo?: boolean;
  tokenInstancia?: string;
  usrCadastro?: string;
  usrDescricaoCadastro?: string;
}

/**
 * Payload enviado pelo n8n ao receber uma mensagem do WhatsApp.
 * Espelhado de WhatsappMessageRequestDto.cs
 */
export interface WhatsappMessageRequestDto {
  messageId: string;
  nomeInstancia: string;
  nrTelefoneCliente: string;
  nomeContato?: string;
  conteudo: string;
  tipoMidia?: string;
  urlMidia?: string;
  enviadaPelaClinica?: boolean;
  dataMensagem: string; // ISO 8601
  esteiraBot?: string;
  metadadosJson?: string;
}
