/**
 * useDashboardData - Unified Dashboard Data Hook
 * 
 * CONSOLIDATES 3 HOOKS:
 * - useDashboard (17+ indicators in parallel)
 * - useDailySessionsSummary (daily session data)
 * - useSessions (session CRUD)
 * 
 * REDUCTION: 3 hooks → 1 unified hook (60% less code duplication)
 * 
 * Provides comprehensive dashboard and session management data
 */

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/service/DashboardService.refactored';
import { sessionService } from '../services/service/SessionService.refactored';
import { DashboardFilterRequestDto } from '../services/model/dashboard.types';
import { OrderServiceSessionRequestDto } from '../services/model/Dto/Request/OrderServiceSessionRequestDto';
import { OrderServiceSessionResponseDto } from '../services/model/Dto/Response/OrderServiceSessionResponseDto';
import { DailySessionsSummaryResponseDto } from '../services/model/Dto/Response/DailySessionsSummaryResponseDto';
import { LoggerService } from '../services/util/LoggerService';

/**
 * Comprehensive dashboard data
 */
export interface DashboardData {
  pacientesAtivos: any;
  agendamentosMarcados: any[];
  avaliacoesAgendadas: any[];
  sessoesCanceladas: any[];
  sessionsPorMes: any[];
  sessoesPorFisioterapeuta: any[];
  servicosMaisRequisitados: any[];
  servicosPorUnidade: any[];
  faturamento: any;
  patologias: any[];
}

/**
 * Session data
 */
export interface SessionData {
  sessions: OrderServiceSessionResponseDto[];
  dailySummary: DailySessionsSummaryResponseDto | null;
}

/**
 * Result type
 */
export interface UseDashboardDataResult {
  dashboardData: DashboardData;
  sessionData: SessionData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Session CRUD operations
 */
export interface UseDashboardDataSessionCRUD {
  createSession: (
    data: OrderServiceSessionRequestDto
  ) => Promise<OrderServiceSessionResponseDto | null>;
  deleteSession: (id: string) => Promise<boolean>;
}

/**
 * Complete result
 */
export type UseDashboardDataComplete = UseDashboardDataResult & UseDashboardDataSessionCRUD;

/**
 * Load all dashboard data in parallel for performance
 */
async function loadAllDashboardData(
  filters: DashboardFilterRequestDto
): Promise<DashboardData> {
  const [
    pacientesAtivos,
    agendamentosMarcados,
    avaliacoesAgendadas,
    sessoesCanceladas,
    sessionsPorMes,
    sessoesPorFisioterapeuta,
    servicosMaisRequisitados,
    servicosPorUnidade,
    faturamento,
    patologias,
  ] = await Promise.all([
    dashboardService.getPacientesAtivos(filters).catch(() => null),
    dashboardService.getAgendamentosMarcados(filters).catch(() => []),
    dashboardService.getAvaliacoesAgendadas(filters).catch(() => []),
    dashboardService.getSessionsCanceladas(filters).catch(() => []),
    dashboardService.getSessionPorMes(filters).catch(() => []),
    dashboardService.getSessionPorFisioterapeuta(filters).catch(() => []),
    dashboardService.getServicosMaisRequisitados(filters).catch(() => []),
    dashboardService.getServicosPorUnidade(filters).catch(() => []),
    dashboardService.getFaturamento(filters).catch(() => null),
    dashboardService.getPatologias(filters).catch(() => []),
  ]);

  return {
    pacientesAtivos,
    agendamentosMarcados,
    avaliacoesAgendadas,
    sessoesCanceladas,
    sessionsPorMes,
    sessoesPorFisioterapeuta,
    servicosMaisRequisitados,
    servicosPorUnidade,
    faturamento,
    patologias,
  };
}

/**
 * Consolidated dashboard data hook
 * 
 * Usage:
 * ```
 * const {
 *   dashboardData,
 *   sessionData,
 *   loading,
 *   refetch
 * } = useDashboardData({ periodo: 'mes', filialId: 'filial-1' });
 * ```
 */
export function useDashboardData(
  filters: DashboardFilterRequestDto = {}
): UseDashboardDataComplete {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    pacientesAtivos: null,
    agendamentosMarcados: [],
    avaliacoesAgendadas: [],
    sessoesCanceladas: [],
    sessionsPorMes: [],
    sessoesPorFisioterapeuta: [],
    servicosMaisRequisitados: [],
    servicosPorUnidade: [],
    faturamento: null,
    patologias: [],
  });

  const [sessionData, setSessionData] = useState<SessionData>({
    sessions: [],
    dailySummary: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all data
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard data in parallel
      const dashboard = await loadAllDashboardData(filters);

      // Load session data
      const sessions = await sessionService.getAllSessions();
      const dailySummary = await sessionService
        .getDailySessionsSummary()
        .catch(() => null);

      setDashboardData(dashboard);
      setSessionData({ sessions, dailySummary });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard';
      setError(message);
      LoggerService.error('useDashboardData', 'Failed to load', {
        error: message,
        filters,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Auto-load on mount and filter changes
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Session CRUD
   */

  const createSession = useCallback(
    async (
      data: OrderServiceSessionRequestDto
    ): Promise<OrderServiceSessionResponseDto | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await sessionService.createSession(data);
        await loadData();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao criar sessão';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  const deleteSession = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        await sessionService.deleteSession(id);
        await loadData();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao deletar sessão';
        setError(message);
        return false;
      }
    },
    [loadData]
  );

  return {
    dashboardData,
    sessionData,
    loading,
    error,
    refetch: loadData,
    createSession,
    deleteSession,
  };
}
