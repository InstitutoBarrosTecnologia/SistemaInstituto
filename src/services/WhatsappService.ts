import { instanceApi } from './service/AxioService';
import type {
  WhatsappConversationResponseDto,
  WhatsappMessageResponseDto,
  WhatsappNumberResponseDto,
  WhatsappNumberRequestDto,
} from './model/WhatsappTypes';

// ──────────────────────────────────────────────
// Conversas
// ──────────────────────────────────────────────

export async function getConversas(
  whatsappNumberId?: string
): Promise<WhatsappConversationResponseDto[]> {
  const params = whatsappNumberId ? { whatsappNumberId } : undefined;
  const response = await instanceApi.get<WhatsappConversationResponseDto[]>(
    '/Whatsapp/GetConversas',
    { params }
  );
  return response.data;
}

export async function getMensagens(
  conversaId: string
): Promise<WhatsappMessageResponseDto[]> {
  const response = await instanceApi.get<WhatsappMessageResponseDto[]>(
    `/Whatsapp/GetMensagens/${conversaId}`
  );
  return response.data;
}

export async function marcarComoLida(conversaId: string): Promise<void> {
  await instanceApi.patch(`/Whatsapp/MarcarComoLida/${conversaId}`);
}

// ──────────────────────────────────────────────
// Números WhatsApp
// ──────────────────────────────────────────────

export async function getWhatsappNumbers(): Promise<WhatsappNumberResponseDto[]> {
  const response = await instanceApi.get<WhatsappNumberResponseDto[]>(
    '/WhatsappNumber/GetAll'
  );
  return response.data;
}

export async function createWhatsappNumber(
  data: WhatsappNumberRequestDto
): Promise<WhatsappNumberResponseDto> {
  const response = await instanceApi.post<WhatsappNumberResponseDto>(
    '/WhatsappNumber/Register',
    data
  );
  return response.data;
}

export async function updateWhatsappNumber(
  id: string,
  data: WhatsappNumberRequestDto
): Promise<WhatsappNumberResponseDto> {
  const response = await instanceApi.put<WhatsappNumberResponseDto>(
    `/WhatsappNumber/Update/${id}`,
    data
  );
  return response.data;
}

export async function toggleWhatsappNumber(id: string): Promise<void> {
  await instanceApi.patch(`/WhatsappNumber/ToggleActive/${id}`);
}
