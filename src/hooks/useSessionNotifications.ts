import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { getDailySessionsSummaryAsync } from '../services/service/SessionService';
import { DailySessionsSummaryResponseDto, SessionDetailResponseDto } from '../services/model/Dto/Response/DailySessionsSummaryResponseDto';

interface SessionNotificationData extends SessionDetailResponseDto {
  isNew?: boolean;
  timeAgo?: string;
}

export const useSessionNotifications = () => {
  const queryClient = useQueryClient();
  const [newSessionsCount, setNewSessionsCount] = useState(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const previousSessionsCount = useRef<number | null>(null); // null indica que ainda não carregou dados
  const [notificationSessions, setNotificationSessions] = useState<SessionNotificationData[]>([]);
  const isFirstLoad = useRef(true); // Flag para controlar primeira carga

  // Query com refetch automático a cada 5 minutos
  const { 
    data: sessionsData, 
    isLoading, 
    error,
    dataUpdatedAt 
  } = useQuery<DailySessionsSummaryResponseDto>({
    queryKey: ['daily-sessions-summary-notifications'],
    queryFn: () => getDailySessionsSummaryAsync(),
    refetchInterval: 5 * 60 * 1000, // 5 minutos
    refetchIntervalInBackground: true,
    staleTime: 0, // Sempre considerar dados como stale para garantir fetch
    cacheTime: 10 * 60 * 1000, // 10 minutos de cache
  });

  // Função para calcular tempo decorrido
  const calculateTimeAgo = (sessionDate: string): string => {
    const now = new Date();
    const sessionTime = new Date(sessionDate);
    const diffInMinutes = Math.floor((now.getTime() - sessionTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  // Monitora mudanças nos dados das sessões
  // LÓGICA DE NOTIFICAÇÃO:
  // - Primeira carga: apenas inicializa, SEM notificar
  // - Aumento de sessões: 1 -> 2 sessões = NOTIFICA (1 nova)
  // - Mesmo número: 2 -> 2 sessões = NÃO notifica
  // - Diminuição: 2 -> 1 sessões = NÃO notifica (atualiza dados apenas)
  useEffect(() => {
    if (sessionsData) {
      const currentSessionsCount = sessionsData.totalSessoes;
      
      // Se é a primeira carga, apenas inicializa sem notificar
      if (isFirstLoad.current) {
        previousSessionsCount.current = currentSessionsCount;
        isFirstLoad.current = false;
        
        // Apenas inicializar as sessões sem marcar como novas
        const sessionsWithMetadata: SessionNotificationData[] = sessionsData.sessoes
          .sort((a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime())
          .map(session => ({
            ...session,
            isNew: false,
            timeAgo: calculateTimeAgo(session.dataSessao)
          }));
        
        setNotificationSessions(sessionsWithMetadata);
        return;
      }
      
      // Se houve aumento no número de sessões (comparado com a última verificação)
      if (previousSessionsCount.current !== null && currentSessionsCount > previousSessionsCount.current) {
        const newSessionsAmount = currentSessionsCount - previousSessionsCount.current;
        setNewSessionsCount(newSessionsAmount);
        setHasNewNotifications(true);
        
        // Marcar as sessões mais recentes como novas
        const sessionsWithMetadata: SessionNotificationData[] = sessionsData.sessoes
          .sort((a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime())
          .map((session, index) => ({
            ...session,
            isNew: index < newSessionsAmount,
            timeAgo: calculateTimeAgo(session.dataSessao)
          }));
        
        setNotificationSessions(sessionsWithMetadata);
      } else if (previousSessionsCount.current !== null && currentSessionsCount === previousSessionsCount.current && sessionsData.sessoes.length > 0) {
        // Atualizar timeAgo das sessões existentes sem alterar status de notificação
        const sessionsWithMetadata: SessionNotificationData[] = sessionsData.sessoes
          .sort((a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime())
          .map(session => ({
            ...session,
            isNew: false, // Não marcar como nova se o total não mudou
            timeAgo: calculateTimeAgo(session.dataSessao)
          }));
        
        setNotificationSessions(sessionsWithMetadata);
      } else if (previousSessionsCount.current !== null && currentSessionsCount < previousSessionsCount.current) {
        // Se o número diminuiu (sessão cancelada/removida), atualizar sem notificar
        const sessionsWithMetadata: SessionNotificationData[] = sessionsData.sessoes
          .sort((a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime())
          .map(session => ({
            ...session,
            isNew: false, // Não marcar como nova se diminuiu
            timeAgo: calculateTimeAgo(session.dataSessao)
          }));
        
        setNotificationSessions(sessionsWithMetadata);
      } else if (sessionsData.sessoes.length === 0) {
        // Se não há sessões, limpar lista
        setNotificationSessions([]);
      }
      
      // Atualizar referência do count anterior
      previousSessionsCount.current = currentSessionsCount;
    }
  }, [sessionsData, dataUpdatedAt]);

  // Função para marcar notificações como visualizadas
  const markAsRead = () => {
    setHasNewNotifications(false);
    setNewSessionsCount(0);
    
    // Remover flag "isNew" de todas as sessões
    setNotificationSessions(prev => prev.map(session => ({
      ...session,
      isNew: false
    })));
  };

  // Função para recarregar dados manualmente
  const refetch = () => {
    queryClient.invalidateQueries(['daily-sessions-summary-notifications']);
  };

  return {
    sessionsData,
    notificationSessions,
    newSessionsCount,
    hasNewNotifications,
    isLoading,
    error,
    markAsRead,
    refetch,
    totalSessions: sessionsData?.totalSessoes || 0,
  };
};
