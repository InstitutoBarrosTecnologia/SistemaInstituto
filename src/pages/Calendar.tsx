import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { BranchOfficeService } from "../services/service/BranchOfficeService";
import EmployeeService from "../services/service/EmployeeService";
import { getAllCustomersAsync } from "../services/service/CustomerService";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import Checkbox from "../components/form/input/Checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Filter, getAllSchedulesAsync, postScheduleAsync, putScheduleAsync } from "../services/service/ScheduleService";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [_, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedFilial, setSelectedFilial] = useState<string | undefined>(undefined);
  const [selectedCliente, setSelectedCliente] = useState<string | undefined>(undefined);
  const [selectedFuncionario, setSelectedFuncionario] = useState<string | undefined>(undefined);
  const [isChecked, setIsChecked] = useState(false);
  const [optionsFilial, setOptionsFilial] = useState<{ label: string; value: string }[]>([]);
  const [optionsCliente, setOptionsCliente] = useState<{ label: string; value: string }[]>([]);
  const [optionsFuncionario, setOptionsFuncionario] = useState<{ label: string; value: string }[]>([]);
  const [filter, setFilter] = useState<Filter>({});


  const { isLoading, data: schedules, refetch: refetchCalendar } = useQuery({
    queryKey: ["schedules", filter],
    queryFn: () => getAllSchedulesAsync(filter)
  })

  useEffect(() => {
    if (schedules) {
      const formattedEvents = schedules.map((schedule) => ({
        id: schedule.id,
        title: schedule.titulo,
        start: schedule.dataInicio,
        end: schedule.dataFim,
        allDay: schedule.diaTodo,
        extendedProps: {
          calendar: "Primary", // You can set this based on your logic
        },
      }));
      setEvents(formattedEvents);
    }
  }, [schedules]);

  const { data: filiaisData } = useQuery({
    queryKey: ["filiais"],
    queryFn: () => BranchOfficeService.getAll(),
  });

  const { data: clientesData } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => getAllCustomersAsync(),
  });

  const { data: funcionariosData } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: () => EmployeeService.getAll(),
  });

  useEffect(() => {
    if (filiaisData) {
      setOptionsFilial(
        filiaisData.map((item: any) => ({
          label: item.nomeFilial,
          value: item.id,
        }))
      );
    }
    if (clientesData) {
      setOptionsCliente(
        clientesData.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }))
      );
    }
    if (funcionariosData) {
      setOptionsFuncionario(
        funcionariosData.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }))
      );
    }
  }, [filiaisData, clientesData, funcionariosData]);

  const { mutateAsync: mutateAddEvent } = useMutation({
    mutationFn: postScheduleAsync,
    onSuccess: () => {
      closeModal();
      resetModalFields();
      refetchCalendar();
    },
    onError: (error) => {
      console.error("Erro ao adicionar evento:", error);
    },
  });

  const { mutateAsync: mutateUpdateEvent } = useMutation({
    mutationFn: putScheduleAsync,
    onSuccess: () => {
      closeModal();
      resetModalFields();
      refetchCalendar();
    },
    onError: (error) => {
      console.error("Erro ao atualizar evento:", error);
    }
  })

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const publicId = clickInfo.event._def.publicId
    const schedule = schedules?.find((schedule) => schedule.id === publicId)
    setSelectedEvent(event as unknown as CalendarEvent);

    if (schedule) {
      setEventTitle(schedule.titulo || "");
      setEventDescription(schedule.descricao || "");
      setEventLocation(schedule.localizacao || "");
      setEventStartDate(schedule.dataInicio ? schedule.dataInicio.slice(0, 16) : "");
      setEventEndDate(schedule.dataFim ? schedule.dataFim.slice(0, 16) : "");
      setEventLevel("Primary");
      setSelectedCliente(schedule.idCliente?.toString() || undefined);
      setSelectedFuncionario(schedule.idFuncionario?.toString() || undefined);
      setSelectedFilial(schedule.filialId?.toString() || undefined);
      setIsChecked(!!schedule.diaTodo);
    }
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      mutateUpdateEvent({
        id: selectedEvent.id,
        titulo: eventTitle,
        descricao: eventDescription,
        localizacao: eventLocation,
        dataInicio: eventStartDate,
        dataFim: eventEndDate,
        diaTodo: isChecked,
        observacao: eventTitle, // Assuming observation is the same as title for now
        notificar: false, // Assuming no notification for now
        status: 1, // Assuming status is active
        idCliente: selectedCliente,
        idFuncionario: selectedFuncionario,
        filialId: selectedFilial,
      });
    } else {
      mutateAddEvent({
        idCliente: selectedCliente,
        idFuncionario: selectedFuncionario,
        filialId: selectedFilial,
        titulo: eventTitle,
        descricao: eventDescription, // Assuming description is the same as title for now
        localizacao: eventLocation, // Assuming location is the same as title for now
        dataInicio: eventStartDate,
        dataFim: eventEndDate,
        diaTodo: isChecked,
        observacao: eventTitle, // Assuming observation is the same as title for now
        notificar: false, // Assuming no notification for now
        status: 1, // Assuming status is active
      })
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setEventDescription("");
    setEventLocation("");
    setSelectedEvent(null);
  };

  const handleOpenModal = () => {
    resetModalFields();
    openModal();
  };

  // Atualize o filtro quando a filial for selecionada
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      filialId: selectedFilial || undefined,
    }));
  }, [selectedFilial]);

  // Atualize o filtro quando o funcionário for selecionado
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      idFuncionario: selectedFuncionario || undefined,
    }));
  }, [selectedFuncionario]);

  return (
    <>
      <PageMeta
        title="Instituto Barros - Sistema"
        description="Sistema Instituto Barros - Página para gerenciamento de Agenda"
      />
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <PageBreadcrumb pageTitle="Agenda Instituto Barros" />
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Label className="mb-0 font-medium text-xs text-gray-700 dark:text-gray-200 whitespace-nowrap mr-2">Filial:</Label>
            <Select
              options={[{ label: "Todas", value: "" }, ...optionsFilial]}
              value={selectedFilial || ""}
              placeholder="Filial"
              onChange={(value) => setSelectedFilial(value === "" ? undefined : value)}
              className="w-28 text-xs h-8 px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <Label className="mb-0 font-medium text-xs text-gray-700 dark:text-gray-200 whitespace-nowrap mr-2">Fisioterapeuta:</Label>
            <Select
              options={[{ label: "Todos", value: "" }, ...optionsFuncionario]}
              value={selectedFuncionario || ""}
              placeholder="Fisioterapeuta"
              onChange={(value) => setSelectedFuncionario(value === "" ? undefined : value)}
              className="w-36 text-xs h-8 px-2 py-1"
            />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[ptBrLocale]}
            locale="pt-br"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            customButtons={{
              addEventButton: {
                text: "Novo Evento",
                click: handleOpenModal,
              },
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] m-4"
        >
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Editar Evento" : "Novo Evento"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agende ou edite um evento e mantanha a clínica em ordem
              </p>
            </div>
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 ">
                <div>
                  <Label >
                    Título Evento
                  </Label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label >
                    Descrição
                  </Label>
                  <input
                    id="event-description"
                    type="text"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label >
                    Localização
                  </Label>
                  <input
                    id="event-location"
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 ">
                <div>
                  <Label >
                    Data & Hora Início
                  </Label>
                  <div className="relative">
                    <input
                      id="event-start-date"
                      type="datetime-local"
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
                </div>
                <div>
                  <Label >
                    Data & Fora Fim
                  </Label>
                  <div className="relative">
                    <input
                      id="event-end-date"
                      type="datetime-local"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 ">
                <div>
                  <Label>Cliente</Label>
                  <Select
                    options={optionsCliente}
                    value={selectedCliente}
                    placeholder="Selecione uma filial"
                    onChange={(value) =>
                      setSelectedCliente(value === "" ? undefined : value)
                    }
                    className="dark:bg-dark-900"

                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Fisioterapeuta
                  </Label>
                  <Select
                    options={optionsFuncionario}
                    value={selectedFuncionario}
                    placeholder="Selecione um fisioterapeuta"
                    onChange={(value) =>
                      setSelectedFuncionario(value === "" ? undefined : value)
                    }
                    className="dark:bg-dark-900"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Unidade / Filial
                  </Label>
                  <Select
                    options={optionsFilial}
                    value={selectedFilial}
                    placeholder="Selecione uma filial"
                    onChange={(value) =>
                      setSelectedFilial(value === "" ? undefined : value)
                    }
                    className="dark:bg-dark-900"
                  />
                </div>
              </div>
              <br></br>
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Dia todo
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Fechar
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {selectedEvent ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </div>
        </Modal >
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60">
            <svg className="animate-spin h-12 w-12 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        )}
      </div >
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;