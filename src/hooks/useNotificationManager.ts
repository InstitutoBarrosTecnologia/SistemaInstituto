/**
 * useNotificationManager - Unified Notification Management Hook
 * 
 * CONSOLIDATES 3 HOOKS:
 * - useNotifications
 * - useNotificationHistory
 * - useSessionNotifications (partial - real-time monitoring)
 * 
 * REDUCTION: 3 hooks → 1 unified hook (66% less code duplication)
 * 
 * Provides comprehensive notification management:
 * - CRUD operations for notifications
 * - Pagination and filtering
 * - History tracking
 * - Real-time monitoring via polling
 */

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/service/NotificationService.refactored';
import { NotificationFilterParams } from '../services/service/NotificationService.refactored';
import { NotificationRequestDto } from '../services/model/Dto/Request/NotificationRequestDto';
import { NotificationHistoryRequestDto } from '../services/model/Dto/Request/NotificationHistoryRequestDto';
import { NotificationResponseDto } from '../services/model/Dto/Response/NotificationResponseDto';
import { NotificationListResponseDto } from '../services/model/Dto/Response/NotificationListResponseDto';
import { LoggerService } from '../services/util/LoggerService';

/**
 * Notification mode
 */
export enum NotificationMode {
  LIST = 'list', // Get current notifications
  HISTORY = 'history', // Get notification history
  MONITOR = 'monitor', // Real-time polling for new notifications
}

/**
 * Base result type
 */
export interface UseNotificationManagerResult {
  notifications: NotificationResponseDto[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalCount: number;
    page: number;
    pageSize: number;
  };
  refetch: () => Promise<void>;
}

/**
 * CRUD operations
 */
export interface UseNotificationManagerCRUD {
  createNotification: (data: NotificationRequestDto) => Promise<boolean>;
  updateNotification: (id: string, data: NotificationRequestDto) => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  toggleNotificationStatus: (id: string, ativo: boolean) => Promise<boolean>;
  sendNotification: (id: string) => Promise<boolean>;
}

/**
 * Complete notification manager result
 */
export type UseNotificationManagerComplete = UseNotificationManagerResult & UseNotificationManagerCRUD;

/**
 * Consolidated notification manager hook
 * 
 * Usage:
 * ```
 * const { notifications, loading, createNotification, refetch } = useNotificationManager(
 *   NotificationMode.LIST,
 *   { page: 1, pageSize: 10, ativo: true }
 * );
 * ```
 */
export function useNotificationManager(
  mode: NotificationMode = NotificationMode.LIST,
  params: NotificationFilterParams | NotificationHistoryRequestDto = {}
): UseNotificationManagerComplete {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    pageSize: 10,
  });

  /**
   * Load notifications based on mode
   */
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response: NotificationListResponseDto;

      switch (mode) {
        case NotificationMode.LIST:
          response = await notificationService.getNotifications(
            params as NotificationFilterParams
          );
          break;
        case NotificationMode.HISTORY:
          response = await notificationService.getNotificationHistory(
            params as NotificationHistoryRequestDto
          );
          break;
        case NotificationMode.MONITOR:
          // Same as LIST but with polling
          response = await notificationService.getNotifications(
            params as NotificationFilterParams
          );
          break;
        default:
          throw new Error(`Unknown notification mode: ${mode}`);
      }

      if (response && Array.isArray(response.data)) {
        setNotifications(response.data);
        setPagination({
          totalCount: response.totalCount || 0,
          page: response.page || 1,
          pageSize: response.pageSize || 10,
        });
      } else {
        setNotifications([]);
        setPagination({ totalCount: 0, page: 1, pageSize: 10 });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar notificações';
      setError(message);
      LoggerService.error('useNotificationManager', `Failed to load ${mode}`, {
        error: message,
        mode,
      });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [mode, params]);

  /**
   * Auto-load on mount and mode/params change
   */
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /**
   * Set up polling for MONITOR mode
   */
  useEffect(() => {
    if (mode !== NotificationMode.MONITOR) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [mode, loadNotifications]);

  /**
   * CRUD Operations
   */

  const createNotification = useCallback(
    async (data: NotificationRequestDto): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await notificationService.createNotification(data);
        await loadNotifications();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao criar notificação';
        setError(message);
        LoggerService.error('useNotificationManager', 'Failed to create', {
          error: message,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadNotifications]
  );

  const updateNotification = useCallback(
    async (id: string, data: NotificationRequestDto): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await notificationService.updateNotification(id, data);
        await loadNotifications();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao atualizar notificação';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadNotifications]
  );

  const deleteNotification = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await notificationService.deleteNotification(id);
        await loadNotifications();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao deletar notificação';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadNotifications]
  );

  const toggleNotificationStatus = useCallback(
    async (id: string, ativo: boolean): Promise<boolean> => {
      try {
        setError(null);
        await notificationService.toggleNotificationStatus(id, ativo);
        await loadNotifications();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao alterar status';
        setError(message);
        return false;
      }
    },
    [loadNotifications]
  );

  const sendNotification = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        await notificationService.sendNotification(id);
        await loadNotifications();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao enviar notificação';
        setError(message);
        return false;
      }
    },
    [loadNotifications]
  );

  return {
    notifications,
    loading,
    error,
    pagination,
    refetch: loadNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    toggleNotificationStatus,
    sendNotification,
  };
}

/**
 * Convenience hook for simple list
 */
export function useNotifications(
  params?: NotificationFilterParams
): Omit<UseNotificationManagerComplete, 'sendNotification'> {
  return useNotificationManager(NotificationMode.LIST, params);
}

/**
 * Convenience hook for history
 */
export function useNotificationHistory(
  params?: NotificationHistoryRequestDto
): Omit<UseNotificationManagerComplete, 'sendNotification'> {
  return useNotificationManager(NotificationMode.HISTORY, params);
}

/**
 * Convenience hook for real-time monitoring
 */
export function useSessionNotifications(
  params?: NotificationFilterParams
): Omit<UseNotificationManagerComplete, 'createNotification' | 'updateNotification' | 'deleteNotification'> {
  return useNotificationManager(NotificationMode.MONITOR, params);
}
