/**
 * Calendar Components - Barrel export
 * 
 * Components:
 * - CalendarView: Pure presentation component
 * - CalendarFiltersPanel: Filter UI
 * - CalendarEventModals: All modal dialogs
 * 
 * Hooks:
 * - useCalendarEvents: Event management logic
 * - useCalendarFilters: Filter management logic
 * - useCalendarModals: Modal state management
 */

export { CalendarView } from './CalendarView';
export { CalendarFiltersPanel } from './CalendarFiltersPanel';
export { CalendarEventModals } from './CalendarEventModals';

export { useCalendarEvents } from '../../hooks/useCalendarEvents';
export { useCalendarFilters } from '../../hooks/useCalendarFilters';
export { useCalendarModals } from '../../hooks/useCalendarModals';

export type { CalendarEvent, CalendarFilters, RecurrenceConfig, EventFormData } from '../../types/calendar';
