/**
 * CalendarView - Pure presentational component for FullCalendar
 * 
 * Displays the calendar and handles event selection/creation UI
 * No business logic, fully controlled by parent
 */

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';

interface CalendarViewProps {
  events: EventInput[];
  onDateSelect?: (arg: DateSelectArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
  isLoading?: boolean;
}

export const CalendarView = React.forwardRef<FullCalendar, CalendarViewProps>(
  ({ events, onDateSelect, onEventClick, isLoading }, ref) => {
    return (
      <div className="calendar-container">
        {isLoading && <div className="text-center p-4">Carregando eventos...</div>}
        
        <FullCalendar
          ref={ref}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          locale={ptBrLocale}
          events={events}
          editable
          selectable
          selectConstraint="businessHours"
          select={onDateSelect}
          eventClick={onEventClick}
          height="auto"
          contentHeight="auto"
        />
      </div>
    );
  }
);

CalendarView.displayName = 'CalendarView';

export default CalendarView;
