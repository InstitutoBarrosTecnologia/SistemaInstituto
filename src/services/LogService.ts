import { LogFilters } from "../pages/Logs/Logs";
import { instanceApi } from "./service/AxioService";
import { LogResponseDto, LogPaginatedResponseDto } from "./model/Dto/Response/LogResponseDto";

export const LogService = {
  async getAllLogs(filters?: LogFilters): Promise<LogPaginatedResponseDto> {
    try {
      const params: any = {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 50,
      };

      if (filters) {
        if (filters.nivel !== undefined && filters.nivel !== null) {
          params.nivel = filters.nivel;
        }
        if (filters.jornadaCritica !== undefined && filters.jornadaCritica !== null) {
          params.jornadaCritica = filters.jornadaCritica;
        }
      }

      const response = await instanceApi.get("/Log", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      throw error;
    }
  },

  async getLogById(id: string): Promise<LogResponseDto> {
    try {
      const response = await instanceApi.get(`/Log/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar log ${id}:`, error);
      throw error;
    }
  },

  async getLogsByDateRange(dataInicio: string, dataFim: string): Promise<LogResponseDto[]> {
    try {
      const response = await instanceApi.get("/Log/por-data", {
        params: { dataInicio, dataFim },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar logs por data:", error);
      throw error;
    }
  },

  async getLogsByUser(usrAcao: string): Promise<LogResponseDto[]> {
    try {
      const response = await instanceApi.get(`/Log/por-usuario/${usrAcao}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar logs do usuário ${usrAcao}:`, error);
      throw error;
    }
  },
};
