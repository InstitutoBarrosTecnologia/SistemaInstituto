import { instanceApi } from "./AxioService";
import { OrderServiceSessionRequestDto } from "../model/Dto/Request/OrderServiceSessionRequestDto";
import { OrderServiceSessionResponseDto } from "../model/Dto/Response/OrderServiceSessionResponseDto";
import { DailySessionsSummaryResponseDto } from "../model/Dto/Response/DailySessionsSummaryResponseDto";

// POST: Cria uma nova sessão
export const createSessionAsync = async (
  request: OrderServiceSessionRequestDto
): Promise<{ data: OrderServiceSessionResponseDto; status: number }> => {
  const response = await instanceApi.post<OrderServiceSessionResponseDto>(
    "/SessionService",
    request
  );
  return {
    data: response.data,
    status: response.status,
  };
};

export interface SessionFilters {
  clienteId?: string;
  dataInicio?: string; // formato YYYY-MM-DD
  dataFim?: string;    // formato YYYY-MM-DD
}

// GET: Lista sessões com filtros opcionais (clienteId, dataInicio, dataFim)
export const getAllSessionsAsync = async (
  clienteIdOrFilters?: string | SessionFilters
): Promise<OrderServiceSessionResponseDto[]> => {
  const params = new URLSearchParams();

  if (typeof clienteIdOrFilters === "string") {
    // compatibilidade retroativa: passar clienteId como string diretamente
    if (clienteIdOrFilters) params.append("ClienteId", clienteIdOrFilters);
  } else if (clienteIdOrFilters) {
    if (clienteIdOrFilters.clienteId) params.append("ClienteId", clienteIdOrFilters.clienteId);
    if (clienteIdOrFilters.dataInicio) params.append("dataInicio", clienteIdOrFilters.dataInicio);
    if (clienteIdOrFilters.dataFim) params.append("dataFim", clienteIdOrFilters.dataFim);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await instanceApi.get<OrderServiceSessionResponseDto[]>(
    `/SessionService/GetByAllSessionService${query}`
  );
  return response.data;
};

// GET: Busca uma sessão específica por ID
export const getSessionByIdAsync = async (
  id: string
): Promise<OrderServiceSessionResponseDto> => {
  const response = await instanceApi.get<OrderServiceSessionResponseDto>(
    `/SessionService/${id}`
  );
  return response.data;
};

// GET: Recuperar resumo das sessões do dia com detalhes do fisioterapeuta e cliente
export const getDailySessionsSummaryAsync = async (
  date?: string
): Promise<DailySessionsSummaryResponseDto> => {
  const query = date ? `?date=${date}` : "";
  const response = await instanceApi.get<DailySessionsSummaryResponseDto>(
    `/SessionService/daily-summary${query}`
  );
  return response.data;
};

// DELETE: Deletar sessão (check-in) - APENAS ADMINISTRADOR
export const deleteSessionAsync = async (
  id: string
): Promise<{ status: number }> => {
  const response = await instanceApi.delete(`/SessionService/${id}`);
  return { status: response.status };
};
