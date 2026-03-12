import { instanceApi } from "./AxioService";
import { NotificationRequestDto } from "../model/Dto/Request/NotificationRequestDto";
import { NotificationHistoryRequestDto } from "../model/Dto/Request/NotificationHistoryRequestDto";
import { NotificationStatusRequestDto } from "../model/Dto/Request/NotificationStatusRequestDto";
import { NotificationResponseDto } from "../model/Dto/Response/NotificationResponseDto";
import { NotificationListResponseDto } from "../model/Dto/Response/NotificationListResponseDto";
import { NotificationSendResponseDto } from "../model/Dto/Response/NotificationSendResponseDto";

export interface NotificationFilterParams {
  page?: number;
  pageSize?: number;
  ativo?: boolean;
  destinatarios?: string;
  admin?: boolean;
}

export class NotificationService {
  private static baseUrl = "/Notifications";
  private static adminBaseUrl = "/Notifications/admin";

  // Criar notificação
  static async createNotification(data: NotificationRequestDto): Promise<NotificationResponseDto> {
    const response = await instanceApi.post<NotificationResponseDto>(
      `${this.baseUrl}`,
      data
    );
    return response.data;
  }

  // Listar notificações com paginação
  static async getNotifications(params: NotificationFilterParams = {}): Promise<NotificationListResponseDto> {
    try {
      const { page = 1, pageSize = 10, ativo, destinatarios, admin } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (ativo !== undefined) {
        queryParams.append('ativo', ativo.toString());
      }

      if (destinatarios) {
        queryParams.append('destinatarios', destinatarios);
      }

      const url = `${(admin ? this.adminBaseUrl : this.baseUrl)}?${queryParams.toString()}`;

      const response = await instanceApi.get<NotificationListResponseDto>(url);
      
      // Verificação de segurança para garantir resposta válida
      if (response && response.data) {
        return response.data;
      }
      
      // Retorna estrutura padrão se a resposta for inválida
      return {
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      };
    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
      // Em caso de erro, retorna estrutura padrão
      return {
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      };
    }
  }

  // Buscar notificação por ID
  static async getNotificationById(id: string): Promise<NotificationResponseDto> {
    const response = await instanceApi.get<NotificationResponseDto>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  // Atualizar notificação
  static async updateNotification(id: string, data: NotificationRequestDto): Promise<NotificationResponseDto> {
    const response = await instanceApi.put<NotificationResponseDto>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  // Excluir notificação
  static async deleteNotification(id: string): Promise<void> {
    await instanceApi.delete(`${this.baseUrl}/${id}`);
  }

  // Ativar/Desativar notificação
  static async toggleNotificationStatus(id: string, ativo: boolean): Promise<NotificationResponseDto> {
    const data: NotificationStatusRequestDto = { ativo };
    const response = await instanceApi.patch<NotificationResponseDto>(
      `${this.baseUrl}/${id}/status`,
      data
    );
    return response.data;
  }

  // Enviar notificação
  static async sendNotification(id: string): Promise<NotificationSendResponseDto> {
    const response = await instanceApi.post<NotificationSendResponseDto>(
      `${this.baseUrl}/${id}/send`
    );
    return response.data;
  }

  // Buscar histórico de notificações com filtros
  static async getNotificationHistory(params: NotificationHistoryRequestDto = {}): Promise<NotificationListResponseDto> {
    try {
      const { 
        criadoPorId, 
        startDate, 
        endDate, 
        status, 
        destinatarios, 
        page = 1, 
        pageSize = 10 
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (criadoPorId) {
        queryParams.append('criadoPorId', criadoPorId);
      }

      // Backend espera DataInicio e DataFim (não startDate/endDate)
      if (startDate) {
        queryParams.append('dataInicio', startDate);
      }

      if (endDate) {
        queryParams.append('dataFim', endDate);
      }

      // Backend espera Ativo (não status)
      if (status !== undefined) {
        queryParams.append('ativo', status.toString());
      }

      if (destinatarios) {
        queryParams.append('destinatarios', destinatarios);
      }

      const response = await instanceApi.get<NotificationListResponseDto>(
        `${this.baseUrl}/history?${queryParams.toString()}`
      );
      
      // Verificação de segurança para garantir resposta válida
      if (response && response.data) {
        return response.data;
      }
      
      // Retorna estrutura padrão se a resposta for inválida
      return {
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      };
    } catch (error) {
      console.error('Erro no getNotificationHistory:', error);
      // Em caso de erro, retorna estrutura padrão
      return {
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
      };
    }
  }

  // Marcar notificação como visualizada
  static async markAsViewed(id: string): Promise<void> {
    await instanceApi.patch(`${this.baseUrl}/${id}/mark-as-viewed`);
  }
}
