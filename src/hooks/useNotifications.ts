import { useState, useEffect } from 'react';
import { NotificationService, NotificationFilterParams } from '../services/service/NotificationService';
import { NotificationResponseDto } from '../services/model/Dto/Response/NotificationResponseDto';
import { NotificationListResponseDto } from '../services/model/Dto/Response/NotificationListResponseDto';
import { NotificationRequestDto } from '../services/model/Dto/Request/NotificationRequestDto';

export const useNotifications = (params: NotificationFilterParams = {}) => {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [loading, setLoading] = useState(true); // Inicia como true para mostrar loading inicial
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    pageSize: 10,
  });

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: NotificationListResponseDto = await NotificationService.getNotifications(params);
      
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
      console.error('Erro no loadNotifications:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao carregar notificações';
      setError(errorMessage);
      setNotifications([]); // Garantir que notifications seja um array mesmo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [params.page, params.pageSize, params.ativo, params.destinatarios]);

  const createNotification = async (data: NotificationRequestDto) => {
    try {
      setLoading(true);
      setError(null);
      await NotificationService.createNotification(data);
      await loadNotifications(); // Recarrega a lista
      return true;
    } catch (err: any) {
      setLoading(false);
      // Lança o erro para ser tratado no componente
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = async (id: string, data: NotificationRequestDto) => {
    try {
      setLoading(true);
      setError(null);
      await NotificationService.updateNotification(id, data);
      await loadNotifications(); // Recarrega a lista
      return true;
    } catch (err: any) {
      setLoading(false);
      // Lança o erro para ser tratado no componente
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await NotificationService.deleteNotification(id);
      await loadNotifications(); // Recarrega a lista
      return true;
    } catch (err: any) {
      setLoading(false);
      // Lança o erro para ser tratado no componente
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, ativo: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await NotificationService.toggleNotificationStatus(id, ativo);
      await loadNotifications(); // Recarrega a lista
      return true;
    } catch (err: any) {
      setLoading(false);
      // Lança o erro para ser tratado no componente
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await NotificationService.sendNotification(id);
      await loadNotifications(); // Recarrega a lista
      return response;
    } catch (err: any) {
      setLoading(false);
      // Lança o erro para ser tratado no componente
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    loading,
    error,
    pagination,
    loadNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    toggleStatus,
    sendNotification,
  };
};
