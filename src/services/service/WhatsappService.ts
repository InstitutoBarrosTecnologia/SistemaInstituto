/**
 * WhatsappService - Serviços para o módulo de WhatsApp
 *
 * Cobre dois controllers:
 *   - /api/Whatsapp      (conversas e mensagens)
 *   - /api/WhatsappNumber (gestão de instâncias/números)
 */

import { BaseApiService } from '../api/BaseApiService';
import { instanceApi } from './AxioService';
import {
  WhatsappNumberRequestDto,
  WhatsappMessageRequestDto,
} from '../model/Dto/Request/WhatsappRequestDto';
import {
  WhatsappConversationResponseDto,
  WhatsappMessageResponseDto,
  WhatsappNumberResponseDto,
} from '../model/Dto/Response/WhatsappResponseDto';

// ---------------------------------------------------------------------------
// WhatsappConversationService  →  /api/Whatsapp
// ---------------------------------------------------------------------------
class WhatsappConversationService extends BaseApiService<
  WhatsappConversationResponseDto,
  WhatsappMessageRequestDto,
  WhatsappMessageRequestDto,
  WhatsappConversationResponseDto
> {
  protected baseUrl = '/Whatsapp';

  /**
   * Recebe uma mensagem do n8n e persiste na conversa correspondente.
   * Cria ou atualiza a conversa automaticamente.
   */
  async receberMensagem(
    request: WhatsappMessageRequestDto
  ): Promise<WhatsappConversationResponseDto> {
    return this.customPost(`${this.baseUrl}/ReceberMensagem`, request);
  }

  /**
   * Retorna todas as conversas, opcionalmente filtradas por número.
   */
  async getConversas(
    whatsappNumberId?: string
  ): Promise<WhatsappConversationResponseDto[]> {
    return this.customGet(`${this.baseUrl}/GetConversas`, whatsappNumberId ? { whatsappNumberId } : undefined);
  }

  /**
   * Retorna todas as mensagens de uma conversa específica.
   */
  async getMensagens(
    conversaId: string
  ): Promise<WhatsappMessageResponseDto[]> {
    return this.customGet<WhatsappMessageResponseDto[]>(
      `${this.baseUrl}/GetMensagens/${conversaId}`
    );
  }

  /**
   * Marca todas as mensagens de uma conversa como lidas.
   */
  async marcarComoLida(conversaId: string): Promise<{ success: boolean }> {
    try {
      const response = await instanceApi.patch<{ success: boolean }>(
        `${this.baseUrl}/MarcarComoLida/${conversaId}`
      );
      return response.data;
    } catch (error) {
      this.handleError('marcarComoLida', error, { conversaId });
      throw this.parseError(error);
    }
  }
}

// ---------------------------------------------------------------------------
// WhatsappNumberService  →  /api/WhatsappNumber
// ---------------------------------------------------------------------------
class WhatsappNumberService extends BaseApiService<
  WhatsappNumberResponseDto,
  WhatsappNumberRequestDto,
  WhatsappNumberRequestDto,
  WhatsappNumberResponseDto
> {
  protected baseUrl = '/WhatsappNumber';

  /**
   * Cadastra um novo número WhatsApp. Apenas Administrador.
   */
  async register(
    request: WhatsappNumberRequestDto
  ): Promise<WhatsappNumberResponseDto> {
    return this.customPost(`${this.baseUrl}/Register`, request);
  }

  /**
   * Atualiza um número WhatsApp existente. Apenas Administrador.
   */
  async updateNumber(
    id: string,
    request: WhatsappNumberRequestDto
  ): Promise<WhatsappNumberResponseDto> {
    return this.update(request, id);
  }

  /**
   * Ativa ou desativa um número WhatsApp. Apenas Administrador.
   */
  async toggleActive(id: string): Promise<{ success: boolean }> {
    try {
      const response = await instanceApi.patch<{ success: boolean }>(
        `${this.baseUrl}/ToggleActive/${id}`
      );
      return response.data;
    } catch (error) {
      this.handleError('toggleActive', error, { id });
      throw this.parseError(error);
    }
  }

  /**
   * Retorna todos os números WhatsApp cadastrados.
   * Acesso: Administrador, Comercial, Administrativo.
   */
  async getAllNumbers(): Promise<WhatsappNumberResponseDto[]> {
    return this.customGet<WhatsappNumberResponseDto[]>(
      `${this.baseUrl}/GetAll`
    );
  }
}

// ---------------------------------------------------------------------------
// Singletons exportados
// ---------------------------------------------------------------------------
export const whatsappConversationService = new WhatsappConversationService();
export const whatsappNumberService = new WhatsappNumberService();

// ---------------------------------------------------------------------------
// Exports funcionais (flat API para uso nos componentes)
// ---------------------------------------------------------------------------

// Conversas
export const receberMensagemAsync = (request: WhatsappMessageRequestDto) =>
  whatsappConversationService.receberMensagem(request);

export const getConversasAsync = (whatsappNumberId?: string) =>
  whatsappConversationService.getConversas(whatsappNumberId);

export const getMensagensAsync = (conversaId: string) =>
  whatsappConversationService.getMensagens(conversaId);

export const marcarComoLidaAsync = (conversaId: string) =>
  whatsappConversationService.marcarComoLida(conversaId);

// Números
export const registerWhatsappNumberAsync = (request: WhatsappNumberRequestDto) =>
  whatsappNumberService.register(request);

export const updateWhatsappNumberAsync = (
  id: string,
  request: WhatsappNumberRequestDto
) => whatsappNumberService.updateNumber(id, request);

export const toggleActiveWhatsappNumberAsync = (id: string) =>
  whatsappNumberService.toggleActive(id);

export const getAllWhatsappNumbersAsync = () =>
  whatsappNumberService.getAllNumbers();

export default whatsappConversationService;
