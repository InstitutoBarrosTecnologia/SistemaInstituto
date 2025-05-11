import { instanceApi } from "./AxioService";
import { OrderServiceSessionRequestDto } from "../model/Dto/Request/OrderServiceSessionRequestDto";
import { OrderServiceSessionResponseDto } from "../model/Dto/Response/OrderServiceSessionResponseDto";

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

// GET: Lista todas as sessões ou filtra por clienteId (opcional)
export const getAllSessionsAsync = async (
  clienteId?: string
): Promise<OrderServiceSessionResponseDto[]> => {
  const query = clienteId ? `?clienteId=${clienteId}` : "";
  const response = await instanceApi.get<OrderServiceSessionResponseDto[]>(
    `/SessionService/GetByAllSessionService/${query}`
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
