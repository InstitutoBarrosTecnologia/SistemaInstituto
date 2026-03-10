/**
 * useScheduleRecurrence - Hook para gerenciar recorrência de agendamentos
 * 
 * Extrai lógica de cálculo de datas recorrentes e criação de agendamentos
 * 
 * Responsabilidades:
 * - Calcular datas com base em dias da semana
 * - Validar horários
 * - Criar agendamentos recorrentes
 * - Gerenciar estado de recorrência
 */

import { useState, useCallback, useMemo } from 'react';
import { LoggerService } from '../services/util/LoggerService';

interface RecurrenceConfig {
  enabled: boolean;
  selectedDays: string[];
  selectedTime: string;
  numberOfSessions: number;
  employeeId?: string;
  branchId?: string;
}

interface CalculatedSchedule {
  date: Date;
  startDateTime: Date;
  endDateTime: Date;
  dayOfWeek: string;
  timeString: string;
}

const DAY_MAP: Record<string, number> = {
  'Segunda-Feira': 1,
  'Terça-Feira': 2,
  'Quarta-Feira': 3,
  'Quinta-Feira': 4,
  'Sexta-Feira': 5,
  'Sábado': 6,
  'Domingo': 0,
};

const REVERSE_DAY_MAP: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-Feira',
  2: 'Terça-Feira',
  3: 'Quarta-Feira',
  4: 'Quinta-Feira',
  5: 'Sexta-Feira',
  6: 'Sábado',
};

export function useScheduleRecurrence(initialConfig: Partial<RecurrenceConfig> = {}) {
  const [config, setConfig] = useState<RecurrenceConfig>({
    enabled: false,
    selectedDays: [],
    selectedTime: '',
    numberOfSessions: 1,
    ...initialConfig,
  });

  /**
   * Calcular próximas datas com base em dias da semana
   */
  const calculateNextDates = useCallback(
    (daysOfWeek: string[], count: number, fromTime?: string): CalculatedSchedule[] => {
      try {
        if (daysOfWeek.length === 0 || count <= 0) {
          return [];
        }

        // Converter dias para números
        const selectedDayNumbers = daysOfWeek
          .map((day) => DAY_MAP[day])
          .filter((day) => day !== undefined)
          .sort((a, b) => a - b);

        if (selectedDayNumbers.length === 0) {
          return [];
        }

        const schedules: CalculatedSchedule[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentDate = new Date(today);
        let sessionsCreated = 0;
        let attempts = 0;
        const maxAttempts = 365; // Máximo 1 ano de procura

        while (sessionsCreated < count && attempts < maxAttempts) {
          const dayOfWeek = currentDate.getDay();

          // Verificar se o dia atual está na lista de dias selecionados
          if (selectedDayNumbers.includes(dayOfWeek)) {
            // Verificar se o horário é válido (não é passado)
            let isValidTime = true;
            if (fromTime && currentDate.toDateString() === today.toDateString()) {
              const [hours, minutes] = fromTime.split(':').map(Number);
              const nowTime = new Date();
              const scheduleTime = new Date(currentDate);
              scheduleTime.setHours(hours, minutes, 0, 0);

              isValidTime = scheduleTime > nowTime;
            }

            if (isValidTime) {
              const startDateTime = new Date(currentDate);
              if (fromTime) {
                const [hours, minutes] = fromTime.split(':').map(Number);
                startDateTime.setHours(hours, minutes, 0, 0);
              } else {
                startDateTime.setHours(9, 0, 0, 0); // Horário padrão 9:00
              }

              const endDateTime = new Date(startDateTime);
              endDateTime.setHours(endDateTime.getHours() + 1); // 1 hora de duração

              schedules.push({
                date: new Date(currentDate),
                startDateTime,
                endDateTime,
                dayOfWeek: REVERSE_DAY_MAP[dayOfWeek],
                timeString: fromTime || '09:00',
              });

              sessionsCreated++;
            }
          }

          // Avançar para o próximo dia
          currentDate.setDate(currentDate.getDate() + 1);
          attempts++;
        }

        if (sessionsCreated < count) {
          LoggerService.warn(
            'useScheduleRecurrence',
            `Only created ${sessionsCreated} of ${count} requested sessions`
          );
        }

        return schedules;
      } catch (error) {
        LoggerService.error(
          'useScheduleRecurrence',
          'Error calculating next dates',
          error
        );
        return [];
      }
    },
    []
  );

  /**
   * Calcular datas com a configuração atual
   */
  const calculatedSchedules = useMemo(() => {
    if (!config.enabled || config.selectedDays.length === 0) {
      return [];
    }

    return calculateNextDates(
      config.selectedDays,
      config.numberOfSessions,
      config.selectedTime
    );
  }, [config.enabled, config.selectedDays, config.numberOfSessions, config.selectedTime, calculateNextDates]);

  /**
   * Atualizar dias selecionados
   */
  const updateSelectedDays = useCallback((days: string[]) => {
    setConfig((prev) => ({
      ...prev,
      selectedDays: days,
    }));
  }, []);

  /**
   * Atualizar horário selecionado
   */
  const updateSelectedTime = useCallback((time: string) => {
    setConfig((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  }, []);

  /**
   * Atualizar número de sessões
   */
  const updateNumberOfSessions = useCallback((count: number) => {
    setConfig((prev) => ({
      ...prev,
      numberOfSessions: Math.max(1, count),
    }));
  }, []);

  /**
   * Atualizar ID do funcionário
   */
  const updateEmployeeId = useCallback((employeeId: string) => {
    setConfig((prev) => ({
      ...prev,
      employeeId,
    }));
  }, []);

  /**
   * Atualizar ID da filial
   */
  const updateBranchId = useCallback((branchId: string) => {
    setConfig((prev) => ({
      ...prev,
      branchId,
    }));
  }, []);

  /**
   * Ativar/desativar recorrência
   */
  const toggleRecurrence = useCallback((enabled?: boolean) => {
    setConfig((prev) => ({
      ...prev,
      enabled: enabled !== undefined ? enabled : !prev.enabled,
    }));
  }, []);

  /**
   * Resetar configuração
   */
  const reset = useCallback(() => {
    setConfig({
      enabled: false,
      selectedDays: [],
      selectedTime: '',
      numberOfSessions: 1,
    });
  }, []);

  /**
   * Validar configuração
   */
  const isValid = useCallback((): boolean => {
    if (!config.enabled) {
      return true;
    }

    return (
      config.selectedDays.length > 0 &&
      config.selectedTime.length > 0 &&
      config.numberOfSessions > 0 &&
      (config.employeeId?.length ?? 0) > 0
    );
  }, [config]);

  /**
   * Obter resumo em texto
   */
  const summary = useMemo(() => {
    if (!config.enabled) {
      return 'Sem recorrência';
    }

    const days = config.selectedDays.join(', ');
    return `${config.numberOfSessions} sessões às ${config.selectedTime} nos dias: ${days}`;
  }, [config.enabled, config.selectedDays, config.numberOfSessions, config.selectedTime]);

  return {
    // Configuração
    config,
    
    // Atualizar configuração
    updateSelectedDays,
    updateSelectedTime,
    updateNumberOfSessions,
    updateEmployeeId,
    updateBranchId,
    toggleRecurrence,
    reset,

    // Dados calculados
    calculatedSchedules,

    // Validação e resumo
    isValid,
    summary,

    // Funções utilitárias
    calculateNextDates,
    dayMap: DAY_MAP,
  };
}

export default useScheduleRecurrence;
