/**
 * useCalendarEvents - Custom hook for event management logic
 * 
 * Extracts business logic from Calendar.tsx
 * Handles:
 * - Event state (create, update, delete)
 * - Recurrence scheduling
 * - Session management
 * - Mutations for API calls
 */

import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllSchedulesAsync,
  postScheduleAsync,
  putScheduleAsync,
  disableScheduleAsync,
  Filter,
} from '../services/service/ScheduleService';
import { getAllSessionsAsync } from '../services/service/SessionService';
import { LoggerService } from '../services/util/LoggerService';
import { CalendarEvent } from '../types/calendar';

interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  clienteId?: string;
  funcionarioId?: string;
  filialId?: string;
  isRecurrent?: boolean;
  recurrenceType?: string;
  recurrenceDays?: string[];
  numSessions?: number;
  endTime?: string;
}

export function useCalendarEvents(filters?: Filter) {
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditingRecurrence, setIsEditingRecurrence] = useState(false);
  const [selectedSessionsToDelete, setSelectedSessionsToDelete] = useState<
    string[]
  >([]);
  const [allRecurrenceSessions, setAllRecurrenceSessions] = useState<any[]>([]);

  // Fetch all schedules
  const {
    data: schedules = [],
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useQuery({
    queryKey: ['schedules', filters],
    queryFn: () => getAllSchedulesAsync(filters!),
    enabled: !!filters,
  });

  // Fetch all sessions
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ['sessions'] as const,
    queryFn: getAllSessionsAsync as () => Promise<any[]>,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateEventPayload) =>
      postScheduleAsync({
        titulo: data.title,
        descricao: data.description,
        localizacao: data.location,
        dataInicio: data.startDate,
        dataFim: data.endDate,
        diaTodo: false,
        clienteId: data.clienteId,
        funcionarioId: data.funcionarioId,
        filialId: data.filialId,
        observacao: '',
        notificar: false,
        status: 0,
      } as any),
    onSuccess: (_newSchedule: any) => {
      LoggerService.info('useCalendarEvents', 'Event created successfully');
      toast.success('Agendamento criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setSelectedEvent(null);
    },
    onError: (error: any) => {
      LoggerService.error('useCalendarEvents', 'Failed to create event', error);
      toast.error('Erro ao criar agendamento');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CreateEventPayload & { id: string }) =>
      putScheduleAsync({
        id: data.id,
        titulo: data.title,
        descricao: data.description,
        localizacao: data.location,
        dataInicio: data.startDate,
        dataFim: data.endDate,
        diaTodo: false,
        clienteId: data.clienteId,
        funcionarioId: data.funcionarioId,
        filialId: data.filialId,
        observacao: '',
        notificar: false,
        status: 0,
      } as any),
    onSuccess: () => {
      LoggerService.info('useCalendarEvents', 'Event updated successfully');
      toast.success('Agendamento atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setSelectedEvent(null);
    },
    onError: (error: any) => {
      LoggerService.error('useCalendarEvents', 'Failed to update event', error);
      toast.error('Erro ao atualizar agendamento');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (selectedSessionsToDelete.length > 0) {
        // Delete selected sessions
        const deletePromises = selectedSessionsToDelete.map((sessionId) =>
          disableScheduleAsync(sessionId)
        );
        await Promise.all(deletePromises);
      } else {
        // Delete single event
        await disableScheduleAsync(eventId);
      }
    },
    onSuccess: () => {
      LoggerService.info('useCalendarEvents', 'Event(s) deleted successfully');
      toast.success('Agendamento(s) removido(s) com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['schedules', 'sessions'] });
      setSelectedEvent(null);
      setSelectedSessionsToDelete([]);
    },
    onError: (error) => {
      LoggerService.error('useCalendarEvents', 'Failed to delete event(s)', error);
      toast.error('Erro ao remover agendamento');
    },
  });

  // Calculate recurrence dates
  const calculateRecurrenceDates = useCallback(
    (
      startDate: Date,
      daysOfWeek: string[],
      numSessions: number
    ): Date[] => {
      try {
        const dates: Date[] = [];
        const dayMap: Record<string, number> = {
          seg: 1,
          ter: 2,
          qua: 3,
          qui: 4,
          sex: 5,
          sab: 6,
          dom: 0,
        };

        const currentDate = new Date(startDate);
        let sessionsCreated = 0;

        while (sessionsCreated < numSessions) {
          const dayOfWeek = currentDate.getDay();
          const dayName = Object.keys(dayMap).find(
            (key) => dayMap[key] === dayOfWeek
          );

          if (dayName && daysOfWeek.includes(dayName)) {
            dates.push(new Date(currentDate));
            sessionsCreated++;
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
      } catch (error) {
        LoggerService.error(
          'useCalendarEvents',
          'Error calculating recurrence dates',
          error
        );
        return [];
      }
    },
    []
  );

  // Handle event selection for details
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  // Handle recurrence mode toggle
  const toggleRecurrenceEditMode = useCallback(() => {
    setIsEditingRecurrence(!isEditingRecurrence);
  }, [isEditingRecurrence]);

  // Handle session selection for deletion
  const toggleSessionSelection = useCallback((sessionId: string) => {
    setSelectedSessionsToDelete((prev) => {
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId);
      } else {
        return [...prev, sessionId];
      }
    });
  }, []);

  return {
    // State
    selectedEvent,
    setSelectedEvent,
    isEditingRecurrence,
    selectedSessionsToDelete,
    allRecurrenceSessions,
    setAllRecurrenceSessions,

    // Data
    schedules,
    sessions,
    isLoading: schedulesLoading || sessionsLoading,
    error: schedulesError || sessionsError,

    // Mutations
    createEvent: createMutation.mutate,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Handlers
    handleSelectEvent,
    toggleRecurrenceEditMode,
    toggleSessionSelection,
    calculateRecurrenceDates,
  };
}
