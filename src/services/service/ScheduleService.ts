import { ScheduleRequestDto } from "../model/Dto/Request/ScheduleRequestDto";
import { instanceApi } from "./AxioService";

// POST - Criar evento de agenda
export const postScheduleAsync = async (
  request: ScheduleRequestDto
): Promise<{ status: number; data?: ScheduleRequestDto }> => {
  const response = await instanceApi.post(`/Schedule`, request);
  return { status: response.status, data: response.data };
};

// PUT - Atualizar evento de agenda
export const putScheduleAsync = async (
  request: ScheduleRequestDto
): Promise<{ status: number; data?: ScheduleRequestDto }> => {
  const response = await instanceApi.put(`/Schedule`, request);
  return { status: response.status, data: response.data };
};

export interface Filter {
  data?: string;
  titulo?: string;
  diaTodo?: boolean;
  idCliente?: string;
  idFuncionario?: string;
  filialId?: string;
}

// GET - Buscar todos os eventos com filtros
export const getAllSchedulesAsync = async (filters: Filter): Promise<ScheduleRequestDto[]> => {
  const response = await instanceApi.get<ScheduleRequestDto[] | null>(`/Schedule`, {
    params: filters,
  });
  return response.data || [];
};

// GET - Buscar evento por ID
export const getScheduleByIdAsync = async (
  id: string
): Promise<ScheduleRequestDto | null> => {
  const response = await instanceApi.get<ScheduleRequestDto | null>(`/Schedule/${id}`);
  return response.data;
};

// PUT - Desativar (soft delete) evento
export const disableScheduleAsync = async (
  id: string
): Promise<{ status: number }> => {
  const response = await instanceApi.put(`/Schedule/disable/${id}`);
  return { status: response.status };
};

// DELETE - Remover evento (delete físico)
export const deleteScheduleAsync = async (
  id: string
): Promise<{ status: number }> => {
  const response = await instanceApi.delete(`/Schedule/${id}`);
  return { status: response.status };
};

// GET - Buscar eventos por data específica
export const getScheduleByDateAsync = async (
  date: string
): Promise<ScheduleRequestDto[] | null> => {
  const response = await instanceApi.get<ScheduleRequestDto[] | null>(`/Schedule/date/${date}`);
  return response.data;
};

// GET - Buscar eventos futuros
export const getUpcomingSchedulesAsync = async (): Promise<ScheduleRequestDto[] | null> => {
  const response = await instanceApi.get<ScheduleRequestDto[] | null>(`/Schedule/upcoming`);
  return response.data;
};
