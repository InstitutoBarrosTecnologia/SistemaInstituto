import { useState, useEffect } from 'react';
import { NotificationService } from '../services/service/NotificationService';
import { NotificationResponseDto } from '../services/model/Dto/Response/NotificationResponseDto';
import { NotificationListResponseDto } from '../services/model/Dto/Response/NotificationListResponseDto';
import { NotificationHistoryRequestDto } from '../services/model/Dto/Request/NotificationHistoryRequestDto';

export const useNotificationHistory = (params: NotificationHistoryRequestDto = {}) => {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    pageSize: 10,
  });

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: NotificationListResponseDto = await NotificationService.getNotificationHistory(params);
      
      // Verificação de segurança para garantir que response.data é um array
      if (response && Array.isArray(response.data)) {
        setNotifications(response.data);
        setPagination({
          totalCount: response.totalCount || 0,
          page: response.page || 1,
          pageSize: response.pageSize || 10,
        });
      } else {
        // Se response.data não for um array, define como array vazio
        setNotifications([]);
        setPagination({
          totalCount: 0,
          page: 1,
          pageSize: 10,
        });
      }
    } catch (err: any) {
      console.error('Erro no loadHistory:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao carregar histórico de notificações';
      setError(errorMessage);
      setNotifications([]); // Garantir que notifications seja um array mesmo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [params.page, params.pageSize, params.searchText, params.startDate, params.endDate, params.status, params.destinatarios]);

  return {
    notifications,
    loading,
    error,
    pagination,
    loadHistory,
  };
};
