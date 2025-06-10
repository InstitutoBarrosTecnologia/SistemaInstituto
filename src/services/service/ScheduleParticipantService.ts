import { ScheduleParticipantRequestDto } from "../model/Dto/Request/ScheduleParticipantRequestDto";
import { instanceApi } from "./AxioService";


// POST - Criar participante da agenda
export const postScheduleParticipantAsync = async (
  request: ScheduleParticipantRequestDto
): Promise<{ status: number; data?: ScheduleParticipantRequestDto }> => {
  const response = await instanceApi.post(`/ScheduleParticipant`, request);
  return { status: response.status, data: response.data };
};

// PUT - Atualizar participante da agenda
export const putScheduleParticipantAsync = async (
  request: ScheduleParticipantRequestDto
): Promise<{ status: number; data?: ScheduleParticipantRequestDto }> => {
  const response = await instanceApi.put(`/ScheduleParticipant`, request);
  return { status: response.status, data: response.data };
};

// GET - Buscar todos os participantes
export const getAllScheduleParticipantsAsync = async (): Promise<ScheduleParticipantRequestDto[] | null> => {
  const response = await instanceApi.get<ScheduleParticipantRequestDto[] | null>(`/ScheduleParticipant`);
  return response.data;
};

// GET - Buscar participante por ID
export const getScheduleParticipantByIdAsync = async (
  id: string
): Promise<ScheduleParticipantRequestDto | null> => {
  const response = await instanceApi.get<ScheduleParticipantRequestDto | null>(`/ScheduleParticipant/${id}`);
  return response.data;
};

// GET - Buscar participantes por ScheduleId
export const getScheduleParticipantsByScheduleIdAsync = async (
  scheduleId: string
): Promise<ScheduleParticipantRequestDto[] | null> => {
  const response = await instanceApi.get<ScheduleParticipantRequestDto[] | null>(
    `/ScheduleParticipant/BySchedule/${scheduleId}`
  );
  return response.data;
};

// DELETE - Excluir participante
export const deleteScheduleParticipantAsync = async (
  id: string
): Promise<{ status: number }> => {
  const response = await instanceApi.delete(`/ScheduleParticipant/${id}`);
  return { status: response.status };
};

// PATCH - Desabilitar participante
export const disableScheduleParticipantAsync = async (
  id: string,
  userDesabled: string
): Promise<{ status: number }> => {
  const response = await instanceApi.patch(`/ScheduleParticipant/disable/${id}`, null, {
    params: { userDesabled }
  });
  return { status: response.status };
};
