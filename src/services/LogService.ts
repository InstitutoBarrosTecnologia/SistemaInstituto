import { instanceApi } from "./service/AxioService";
import { LogResponseDto, LogPaginatedResponseDto } from "./model/Dto/Response/LogResponseDto";
import { LogRequestDto } from "./model/Dto/Request/LogRequestDto";
import { LogFilters } from "../pages/Log/Log";

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
        if (filters.dataInicio) {
          params.dataInicio = filters.dataInicio;
        }
        if (filters.dataFim) {
          params.dataFim = filters.dataFim;
        }
        if (filters.usrAcao) {
          params.usrAcao = filters.usrAcao;
        }
        if (filters.ip) {
          params.ip = filters.ip;
        }
      }

      const response = await instanceApi.get("/Logs", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      throw error;
    }
  },

  async getLogById(id: string): Promise<LogResponseDto> {
    try {
      const response = await instanceApi.get(`/Logs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar log ${id}:`, error);
      throw error;
    }
  },

  async getLogsByDateRange(dataInicio: string, dataFim: string): Promise<LogResponseDto[]> {
    try {
      const response = await instanceApi.get("/Logs/por-data", {
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
      const response = await instanceApi.get(`/Logs/por-usuario/${usrAcao}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar logs do usuário ${usrAcao}:`, error);
      throw error;
    }
  },

  async createLog(log: LogRequestDto): Promise<LogResponseDto> {
    try {
      const response = await instanceApi.post("/Logs", log);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar log:", error);
      throw error;
    }
  },

  async updateLog(id: string, log: LogRequestDto): Promise<LogResponseDto> {
    try {
      const response = await instanceApi.put(`/Logs/${id}`, log);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar log ${id}:`, error);
      throw error;
    }
  },

  async deleteLog(id: string): Promise<void> {
    try {
      await instanceApi.delete(`/Logs/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar log ${id}:`, error);
      throw error;
    }
  },
};
