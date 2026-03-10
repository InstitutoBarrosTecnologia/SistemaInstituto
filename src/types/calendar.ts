/**
 * Calendar Types
 */

import { EventInput } from '@fullcalendar/core';

export interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    clienteId?: string;
    funcionarioId?: string;
    filialId?: string;
    status?: number;
    sessoes?: any[];
    [key: string]: any;
  };
}

export interface CalendarFilters {
  filial?: string;
  cliente?: string;
  funcionario?: string;
  status?: string | number;
  dataInicio?: string;
  dataFim?: string;
}

export interface RecurrenceConfig {
  isRecurrent: boolean;
  type: 'semanal' | 'quinzenal' | 'mensal';
  daysOfWeek: string[];
  numSessions: number;
  endTime?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  clienteId?: string;
  funcionarioId?: string;
  filialId?: string;
  recurrence: RecurrenceConfig;
}
