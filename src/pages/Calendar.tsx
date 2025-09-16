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
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { BranchOfficeService } from "../services/service/BranchOfficeService";
import EmployeeService from "../services/service/EmployeeService";
import { getAllCustomersAsync } from "../services/service/CustomerService";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import MultiSelect from "../components/form/MultiSelect";
import Checkbox from "../components/form/input/Checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Filter,
  getAllSchedulesAsync,
  postScheduleAsync,
  putScheduleAsync,
  deleteScheduleAsync,
} from "../services/service/ScheduleService";
import toast, { Toaster } from "react-hot-toast";
import {
  getUserRoleFromToken,
  getUserFuncionarioIdFromToken,
  shouldApplyAgendaFilter,
} from "../services/util/rolePermissions";
import {
  EScheduleStatus,
  ScheduleStatusLabels,
} from "../services/model/Enum/EScheduleStatus";

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
  const {
    isOpen: isOpenDelete,
    openModal: openModalDelete,
    closeModal: closeModalDelete,
  } = useModal();
  const [selectedFilial, setSelectedFilial] = useState<string | undefined>(
    undefined
  );
  const [selectedCliente, setSelectedCliente] = useState<string | undefined>(
    undefined
  );
  const [selectedFuncionario, setSelectedFuncionario] = useState<
    string | undefined
  >(undefined);
  const [modalFuncionario, setModalFuncionario] = useState<string | undefined>(
    undefined
  );
  const [modalFilial, setModalFilial] = useState<string | undefined>(undefined);
  const [isChecked, setIsChecked] = useState(false);
  const [optionsFilial, setOptionsFilial] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionsCliente, setOptionsCliente] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionsFuncionario, setOptionsFuncionario] = useState<
    { label: string; value: string }[]
  >([]);
  const [filter, setFilter] = useState<Filter>({});
  const [idDeleteRegister, setIdDeleteRegister] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);

  // Estados para recorrência
  const [isRecurrent, setIsRecurrent] = useState<boolean>(false);
  const [selectedDiasSemana, setSelectedDiasSemana] = useState<string[]>([]);
  const [selectedHorarioRecorrente, setSelectedHorarioRecorrente] =
    useState<string>("");
  const [qtdSessoes, setQtdSessoes] = useState<number>(1);
  const [isEditingRecurrence, setIsEditingRecurrence] =
    useState<boolean>(false);

  // Estado para status do agendamento
  const [selectedStatus, setSelectedStatus] = useState<number>(
    EScheduleStatus.AConfirmar
  );

  // Opções para o select de status
  const statusOptions = Object.entries(ScheduleStatusLabels).map(
    ([value, label]) => ({
      label,
      value: value.toString(),
    })
  );

  // Função para mapear status para ícones
  const getStatusIcon = (status: number): string => {
    switch (status) {
      case EScheduleStatus.AConfirmar:
        return "❓"; // interrogação
      case EScheduleStatus.Finalizado:
        return "✅"; // check verde
      case EScheduleStatus.ConfirmadoPeloPaciente:
        return "👍"; // polegar para cima
      case EScheduleStatus.EmEspera:
        return "⏳"; // ampulheta
      case EScheduleStatus.CanceladoPeloProfissional:
        return "❌"; // X vermelho
      case EScheduleStatus.CanceladoPeloPaciente:
        return "✖️"; // X cinza
      case EScheduleStatus.Faltou:
        return "⚠️"; // alerta
      case EScheduleStatus.PreAtendimento:
        return "🔄"; // setas circulares
      case EScheduleStatus.Reagendar:
        return "📅"; // calendário
      case EScheduleStatus.Pagamento:
        return "💰"; // dinheiro
      default:
        return "❓"; // padrão
    }
  };

  // Função para calcular as próximas datas baseado em múltiplos dias da semana
  const getNextDatesForMultipleWeekdays = (
    daysOfWeek: string[],
    count: number
  ): Date[] => {
    const days = {
      "Segunda-Feira": 1,
      "Terça-Feira": 2,
      "Quarta-Feira": 3,
      "Quinta-Feira": 4,
      "Sexta-Feira": 5,
      Sábado: 6,
      Domingo: 0,
    };

    if (daysOfWeek.length === 0) return [];

    // Converter dias selecionados para números e ordenar
    const selectedDayNumbers = daysOfWeek
      .map((day) => days[day as keyof typeof days])
      .filter((day) => day !== undefined)
      .sort((a, b) => a - b);

    if (selectedDayNumbers.length === 0) return [];

    const dates: Date[] = [];
    const today = new Date();

    // Começar da semana atual
    let currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Início da semana (domingo)

    let dayIndex = 0;
    let sessionsCreated = 0;

    while (sessionsCreated < count) {
      const targetDayNumber = selectedDayNumbers[dayIndex];
      const targetDate = new Date(currentWeekStart);
      targetDate.setDate(currentWeekStart.getDate() + targetDayNumber);

      // Verificar se a data é válida (hoje ou futuro)
      let isValidDate = targetDate >= today;

      // Se for hoje, verificar se já passou do horário
      if (
        targetDate.toDateString() === today.toDateString() &&
        selectedHorarioRecorrente
      ) {
        const [hours, minutes] = selectedHorarioRecorrente
          .split(":")
          .map(Number);
        const targetTime = new Date(today);
        targetTime.setHours(hours, minutes, 0, 0);

        // Se já passou do horário hoje, não é válido
        if (today >= targetTime) {
          isValidDate = false;
        }
      }

      // Se a data for válida, adicionar à lista
      if (isValidDate) {
        dates.push(new Date(targetDate));
        sessionsCreated++;
      }

      // Avançar para o próximo dia da lista
      dayIndex = (dayIndex + 1) % selectedDayNumbers.length;

      // Se completou um ciclo pelos dias da semana, avançar para próxima semana
      if (dayIndex === 0) {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
    }

    return dates;
  };

  // Função para buscar sessões futuras de um cliente e fisioterapeuta específicos
  const getFutureSessionsByClientAndPhysiotherapist = (
    clienteId: string,
    funcionarioId: string
  ): any[] => {
    if (!schedules || !clienteId || !funcionarioId) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Início do dia de hoje

    return schedules
      .filter((schedule: any) => {
        // Filtrar por cliente e fisioterapeuta
        if (
          schedule.clienteId !== clienteId ||
          schedule.funcionarioId !== funcionarioId
        ) {
          return false;
        }

        // Filtrar apenas sessões futuras (hoje em diante)
        const scheduleDate = new Date(schedule.dataInicio);
        scheduleDate.setHours(0, 0, 0, 0);

        return scheduleDate >= today;
      })
      .sort((a: any, b: any) => {
        // Ordenar por data crescente
        return (
          new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
        );
      });
  };

  // Função para atualizar recorrência de sessões existentes
  const updateRecurrentSchedules = async () => {
    if (!selectedEvent || !selectedCliente || !modalFuncionario) {
      toast.error("Dados incompletos para atualizar recorrência.");
      return;
    }

    try {
      // Buscar todas as sessões futuras do cliente e fisioterapeuta
      const futureSessions = getFutureSessionsByClientAndPhysiotherapist(
        selectedCliente,
        modalFuncionario
      );

      if (futureSessions.length === 0) {
        toast.error("Não há sessões futuras para atualizar.");
        return;
      }

      // Limitar pela quantidade de sessões especificada
      const sessionsToUpdate = futureSessions.slice(0, qtdSessoes);

      // Extrair horários dos campos de data/hora atualizados pelo usuário
      const originalStartDate = new Date(eventStartDate);
      const originalEndDate = new Date(eventEndDate);
      
      const startHours = originalStartDate.getHours();
      const startMinutes = originalStartDate.getMinutes();
      const endHours = originalEndDate.getHours();
      const endMinutes = originalEndDate.getMinutes();

      console.log("Horários extraídos dos campos:", {
        eventStartDate,
        eventEndDate,
        startHours,
        startMinutes,
        endHours,
        endMinutes,
      });

      // Se há dias da semana selecionados, gerar novas datas baseadas na recorrência
      // Caso contrário, manter as datas existentes e apenas atualizar os horários
      let updatedSessions;      if (selectedDiasSemana && selectedDiasSemana.length > 0) {
        // Gerar novas datas baseadas na nova recorrência
        const newDates = getNextDatesForMultipleWeekdays(
          selectedDiasSemana,
          sessionsToUpdate.length
        );

        if (newDates.length === 0) {
          toast.error("Não foi possível gerar datas para a nova recorrência.");
          return;
        }

        // Aplicar novas datas com horários atualizados
        updatedSessions = sessionsToUpdate.map(
          (session: any, index: number) => {
            const newDate = newDates[index];

            const startDateTime = new Date(newDate);
            startDateTime.setHours(startHours, startMinutes, 0, 0);

            const endDateTime = new Date(newDate);
            endDateTime.setHours(endHours, endMinutes, 0, 0);

           
            return {
              ...session,
              dataInicio: startDateTime.toISOString(),
              dataFim: endDateTime.toISOString(),
            };
          }
        );
      } else {
        // Apenas atualizar os horários nas datas existentes
        updatedSessions = sessionsToUpdate.map((session: any) => {
          const existingDate = new Date(session.dataInicio);

          const startDateTime = new Date(existingDate);
          startDateTime.setHours(startHours, startMinutes, 0, 0);

          const endDateTime = new Date(existingDate);
          endDateTime.setHours(endHours, endMinutes, 0, 0);

          return {
            ...session,
            dataInicio: startDateTime.toISOString(),
            dataFim: endDateTime.toISOString(),
          };
        });
      }

      // Atualizar cada sessão
      const updatePromises = updatedSessions.map(
        (session: any, index: number) => {
          console.log("Dados da sessão antes do PUT:", {
            sessionId: session.id,
            dataInicioOriginal: session.dataInicio,
            dataFimOriginal: session.dataFim,
            eventStartDate,
            eventEndDate,
          });
          
          return putScheduleAsync({
            id: session.id,
            titulo: session.titulo, // Manter o título original da sessão
            descricao: session.descricao || eventDescription,
            localizacao: session.localizacao || eventLocation,
            dataInicio: session.dataInicio, // Deve ter os horários atualizados
            dataFim: session.dataFim, // Deve ter os horários atualizados
            diaTodo: false,
            observacao: `Recorrência atualizada - Sessão ${index + 1} de ${
              updatedSessions.length
            }`,
            notificar: false,
            status: selectedStatus,
            clienteId: selectedCliente,
            funcionarioId: modalFuncionario,
            filialId: modalFilial,
          });
        }
      );

      // Aguardar todas as atualizações serem concluídas
      const results = await Promise.all(updatePromises);

      // Verificar se todas as atualizações foram bem-sucedidas
      const successfulUpdates = results.filter(
        (result) => result?.status === 200
      );

      if (successfulUpdates.length === sessionsToUpdate.length) {
        toast.success(
          `${sessionsToUpdate.length} sessões atualizadas com sucesso!`
        );
        // Refetch apenas após todas as atualizações serem concluídas com sucesso
        await refetchCalendar();
      } else {
        toast.error(
          `Apenas ${successfulUpdates.length} de ${sessionsToUpdate.length} sessões foram atualizadas.`
        );
        // Refetch mesmo com falhas parciais para mostrar o estado atual
        await refetchCalendar();
      }
    } catch (error) {
      console.error("Erro ao atualizar recorrência:", error);
      toast.error("Erro ao atualizar algumas sessões. Verifique o calendário.");
      // Refetch para mostrar o estado atual mesmo em caso de erro
      await refetchCalendar();
    }
  };

  // Função para criar agendamentos recorrentes
  const createRecurrentSchedules = async () => {
    if (
      !isRecurrent ||
      !selectedDiasSemana ||
      selectedDiasSemana.length === 0 ||
      !selectedHorarioRecorrente ||
      qtdSessoes <= 0
    ) {
      return;
    }

    const dates = getNextDatesForMultipleWeekdays(
      selectedDiasSemana,
      qtdSessoes
    );
    const [hours, minutes] = selectedHorarioRecorrente.split(":").map(Number);

    const schedulePromises = dates.map((date: Date, index: number) => {
      const startDateTime = new Date(date);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(hours + 1, minutes, 0, 0); // Assumindo 1 hora de duração

      return postScheduleAsync({
        titulo: `${eventTitle || "Agendamento"} - Sessão ${index + 1}`,
        descricao: eventDescription || "Agendamento recorrente",
        dataInicio: startDateTime.toISOString(),
        dataFim: endDateTime.toISOString(),
        diaTodo: false,
        clienteId: selectedCliente,
        funcionarioId: modalFuncionario,
        filialId: modalFilial,
        localizacao: eventLocation || "Clínica",
        observacao: `Agendamento recorrente - Sessão ${
          index + 1
        } de ${qtdSessoes}`,
        notificar: false,
        status: selectedStatus,
      });
    });

    try {
      // Aguardar todas as criações serem concluídas
      const results = await Promise.all(schedulePromises);

      // Verificar se todas as criações foram bem-sucedidas
      const successfulCreations = results.filter(
        (result) => result?.status === 200
      );

      if (successfulCreations.length === qtdSessoes) {
        toast.success(
          `${qtdSessoes} agendamentos recorrentes criados com sucesso!`
        );
        // Refetch apenas após todas as criações serem concluídas com sucesso
        await refetchCalendar();
      } else {
        toast.error(
          `Apenas ${successfulCreations.length} de ${qtdSessoes} agendamentos foram criados.`
        );
        // Refetch mesmo com falhas parciais para mostrar o estado atual
        await refetchCalendar();
      }
    } catch (error) {
      console.error("Erro ao criar agendamentos recorrentes:", error);
      toast.error("Erro ao criar alguns agendamentos. Verifique o calendário.");
      // Refetch para mostrar o estado atual mesmo em caso de erro
      await refetchCalendar();
    }
  };

  const {
    isLoading,
    data: schedules,
    refetch: refetchCalendar,
  } = useQuery({
    queryKey: ["schedules", filter],
    queryFn: () => getAllSchedulesAsync(filter),
  });

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
    // Cria o map de id do funcionário para cor
    const funcionarioColorMap = (funcionariosData || []).reduce(
      (acc: Record<string, string>, funcionario: any) => {
        if (funcionario.id && funcionario.cor) {
          acc[funcionario.id] = funcionario.cor;
        }
        return acc;
      },
      {}
    );

    if (schedules) {
      const formattedEvents = schedules.map((schedule) => {
        // Buscar nome do cliente
        const cliente = clientesData?.find(
          (c: any) => c.id === schedule.clienteId
        );
        // Buscar nome do funcionário
        const funcionario = funcionariosData?.find(
          (f: any) => f.id === schedule.funcionarioId
        );
        // Buscar nome da filial
        const filial = filiaisData?.find(
          (f: any) => f.id === schedule.filialId
        );

        const corFuncionario =
          schedule.funcionarioId && funcionarioColorMap[schedule.funcionarioId]
            ? funcionarioColorMap[schedule.funcionarioId]
            : undefined;
        return {
          id: schedule.id,
          title: schedule.titulo,
          start: schedule.dataInicio,
          end: schedule.dataFim,
          allDay: schedule.diaTodo,
          extendedProps: {
            calendar: "Primary",
            corFuncionario,
            cliente: cliente?.nome || "Não informado",
            funcionario: funcionario?.nome || "Não informado",
            filial: filial?.nomeFilial || "Não informado",
            observacao: schedule.observacao || "Sem observação",
            status: schedule.status,
          },
        };
      });
      setEvents(formattedEvents);
    }
  }, [schedules, funcionariosData, clientesData, filiaisData]);

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
    onSuccess: (data: any) => {
      if (data?.status === 200 || data?.success === true || data?.id) {
        toast.success("Evento criado com sucesso!", {
          duration: 3000,
        });
        setTimeout(() => {
          closeModal();
          resetModalFields();
          refetchCalendar();
        }, 3000); // Fecha a modal após o toast sumir
      } else {
        toast.error("Erro ao criar evento. Tente novamente.", {
          duration: 3000,
        });
      }
    },
    onError: (error: any) => {
      let message = "Erro ao criar evento. Tente novamente.";
      if (error?.response?.data?.message) message = error.response.data.message;
      else if (error?.message) message = error.message;
      toast.error(message, {
        duration: 3000,
      });
      console.error("Erro ao adicionar evento:", error);
    },
  });

  const { mutateAsync: mutateUpdateEvent } = useMutation({
    mutationFn: putScheduleAsync,
    onSuccess: (data: any) => {
      if (data?.status === 200 || data?.success === true || data?.id) {
        toast.success("Evento atualizado com sucesso!", {
          duration: 3000,
        });
        setTimeout(() => {
          closeModal();
          resetModalFields();
          refetchCalendar();
        }, 3000); // Fecha a modal após o toast sumir
      } else {
        toast.error("Erro ao atualizar evento. Tente novamente.", {
          duration: 3000,
        });
      }
    },
    onError: (error: any) => {
      let message = "Erro ao atualizar evento. Tente novamente.";
      if (error?.response?.data?.message) message = error.response.data.message;
      else if (error?.message) message = error.message;
      toast.error(message, {
        duration: 3000,
      });
      console.error("Erro ao atualizar evento:", error);
    },
  });

  const { mutateAsync: mutateDeleteEvent } = useMutation({
    mutationFn: deleteScheduleAsync,
    onSuccess: () => {
      toast.success("Evento excluído com sucesso!");
      closeModal();
      closeModalDelete();
      resetModalFields();
      refetchCalendar();
    },
    onError: (error) => {
      console.error("Erro ao deletar evento:", error);
      toast.error("Erro ao excluir evento. Tente novamente.");
    },
  });

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const publicId = clickInfo.event._def.publicId;
    const schedule = schedules?.find((schedule) => schedule.id === publicId);
    setSelectedEvent(event as unknown as CalendarEvent);

    if (schedule) {
      setEventTitle(schedule.titulo || "");
      setEventDescription(schedule.descricao || "");
      setEventLocation(schedule.localizacao || "");
      setEventStartDate(
        schedule.dataInicio ? schedule.dataInicio.slice(0, 16) : ""
      );
      setEventEndDate(schedule.dataFim ? schedule.dataFim.slice(0, 16) : "");
      setEventLevel("Primary");
      setSelectedCliente(schedule.clienteId?.toString() || undefined);
      // Usar modalFuncionario para não interferir com o filtro
      setModalFuncionario(schedule.funcionarioId?.toString() || undefined);
      // Usar modalFilial para não interferir com o filtro
      setModalFilial(schedule.filialId?.toString() || undefined);
      setSelectedStatus(schedule.status || EScheduleStatus.AConfirmar);
      setIsChecked(!!schedule.diaTodo);

      // Detectar se é parte de uma recorrência baseado na observação
      const isRecurrentSession =
        schedule.observacao?.includes("Agendamento recorrente") ||
        schedule.observacao?.includes("Recorrência atualizada") ||
        schedule.titulo?.includes("Sessão");

      if (isRecurrentSession && schedule.clienteId && schedule.funcionarioId) {
        // Pré-configurar para edição de recorrência
        setIsEditingRecurrence(true);

        // Extrair horário da data de início
        if (schedule.dataInicio) {
          const scheduleDate = new Date(schedule.dataInicio);
          const hours = scheduleDate.getHours().toString().padStart(2, "0");
          const minutes = scheduleDate.getMinutes().toString().padStart(2, "0");
          setSelectedHorarioRecorrente(`${hours}:${minutes}`);
        }

        // Buscar sessões futuras para determinar quantidade
        const futureSessions = getFutureSessionsByClientAndPhysiotherapist(
          schedule.clienteId,
          schedule.funcionarioId
        );
        setQtdSessoes(futureSessions.length);
      } else {
        setIsEditingRecurrence(false);
      }
    }
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    // Se for recorrência, usar a função específica
    if (isRecurrent && !selectedEvent) {
      // Validações para recorrência
      if (!selectedDiasSemana || selectedDiasSemana.length === 0) {
        toast.error(
          "Selecione pelo menos um dia da semana para a recorrência."
        );
        return;
      }
      if (!selectedHorarioRecorrente) {
        toast.error("Selecione o horário para a recorrência.");
        return;
      }
      if (qtdSessoes <= 0) {
        toast.error("Defina a quantidade de sessões.");
        return;
      }

      await createRecurrentSchedules();
      closeModal();
      resetModalFields();
      return;
    }

    // Se for edição de recorrência
    if (isRecurrent && selectedEvent && isEditingRecurrence) {
      // Validações para edição de recorrência
      if (!selectedDiasSemana || selectedDiasSemana.length === 0) {
        toast.error(
          "Selecione pelo menos um dia da semana para a recorrência."
        );
        return;
      }
      if (!selectedHorarioRecorrente) {
        toast.error("Selecione o horário para a recorrência.");
        return;
      }
      if (qtdSessoes <= 0) {
        toast.error("Defina a quantidade de sessões.");
        return;
      }
      if (!selectedCliente || !modalFuncionario) {
        toast.error(
          "Cliente e fisioterapeuta são obrigatórios para editar recorrência."
        );
        return;
      }

      await updateRecurrentSchedules();
      closeModal();
      resetModalFields();
      return;
    }

    // Lógica normal para evento único ou edição
    if (selectedEvent) {
      mutateUpdateEvent({
        id: selectedEvent.id,
        titulo: eventTitle,
        descricao: eventDescription,
        localizacao: eventLocation,
        dataInicio: eventStartDate,
        dataFim: eventEndDate,
        diaTodo: isChecked,
        observacao: eventTitle,
        notificar: false,
        status: selectedStatus,
        clienteId: selectedCliente,
        funcionarioId: modalFuncionario,
        filialId: modalFilial,
      });
    } else {
      mutateAddEvent({
        clienteId: selectedCliente,
        funcionarioId: modalFuncionario,
        filialId: modalFilial,
        titulo: eventTitle,
        descricao: eventDescription,
        localizacao: eventLocation,
        dataInicio: eventStartDate,
        dataFim: eventEndDate,
        diaTodo: isChecked,
        observacao: eventTitle,
        notificar: false,
        status: selectedStatus,
      });
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && selectedEvent.id) {
      setIdDeleteRegister(selectedEvent.id);
      openModalDelete();
    }
  };

  const handlePostDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idDeleteRegister) {
      mutateDeleteEvent(idDeleteRegister);
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
    setSelectedCliente(undefined);
    setModalFuncionario(undefined);
    setModalFilial(undefined);
    setSelectedStatus(EScheduleStatus.AConfirmar);
    setIsChecked(false);

    setIsRecurrent(false);
    setSelectedDiasSemana([]);
    setSelectedHorarioRecorrente("");
    setQtdSessoes(1);
    setIsEditingRecurrence(false);
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

  const renderEventContent = (eventInfo: any) => {
    // Usa a cor do funcionário, se não houver, usa azul padrão
    const cor = eventInfo.event.extendedProps.corFuncionario || "#2563eb"; // azul padrão

    // Função para determinar se a cor é clara ou escura
    const isLightColor = (hexColor: string) => {
      const hex = hexColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    // Define cor do texto baseada no fundo
    const textColor = isLightColor(cor) ? "#000000" : "#ffffff";

    const { cliente, funcionario, filial, observacao, status } =
      eventInfo.event.extendedProps;

    // Função para truncar o nome do cliente
    const truncateText = (text: string, maxLength: number = 15) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

    // Renderiza o conteúdo do evento
    return (
      <div
        className="event-fc-color flex fc-event-main p-1 rounded-sm relative group cursor-pointer"
        style={{ background: cor, borderColor: cor }}
      >
        <div
          className="fc-daygrid-event-dot"
          style={{ background: textColor }}
        ></div>
        <div
          className="fc-event-status-icon"
          style={{
            fontSize: "12px",
            marginRight: "4px",
            marginLeft: "2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {getStatusIcon(status)}
        </div>
        <div className="fc-event-time" style={{ color: textColor }}>
          {eventInfo.timeText}
        </div>
        <div className="fc-event-title" style={{ color: textColor }}>
          {truncateText(cliente)}
        </div>

        {/* Tooltip personalizado */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 min-w-max max-w-xs">
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="text-gray-300 font-medium">Título:</span>
              <span className="text-white">{eventInfo.event.title}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-300 font-medium">Horário:</span>
              <span className="text-white">{eventInfo.timeText}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-300 font-medium">Cliente:</span>
              <span className="text-white">{cliente}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-300 font-medium">Filial:</span>
              <span className="text-white">{filial}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-300 font-medium">Funcionário:</span>
              <span className="text-white">{funcionario}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-300 font-medium">Observação:</span>
              <span className="text-white">{truncateText(observacao, 23)}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-300 font-medium">Status:</span>
              <span className="text-white">
                {ScheduleStatusLabels[
                  status as keyof typeof ScheduleStatusLabels
                ] || "Status desconhecido"}
              </span>
            </div>
          </div>
          {/* Seta do tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800"></div>
        </div>
      </div>
    );
  };

  // Atualize o filtro quando o fisioterapeuta for selecionado
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      idFuncionario: selectedFuncionario || undefined,
    }));
  }, [selectedFuncionario]);

  // Aplica filtro automático para fisioterapeutas
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUserRole = getUserRoleFromToken(token);
    setUserRole(currentUserRole);

    if (shouldApplyAgendaFilter(currentUserRole)) {
      // Se é fisioterapeuta, aplicar filtro por ID do funcionário
      const funcionarioId = getUserFuncionarioIdFromToken(token);
      if (funcionarioId) {
        setFilter((prev) => ({
          ...prev,
          idFuncionario: funcionarioId,
        }));
        setSelectedFuncionario(funcionarioId);
      }
    }
  }, []);

  return (
    <>
      <PageMeta
        title="Sistema Instituto Barros - Agenda"
        description="Sistema Instituto Barros - Página para gerenciamento de Agenda"
      />
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <PageBreadcrumb pageTitle="Agenda" />
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Label className="mb-0 font-medium text-xs text-gray-700 dark:text-gray-200 whitespace-nowrap mr-2">
              Filial:
            </Label>
            <Select
              options={[{ label: "Todas", value: "" }, ...optionsFilial]}
              value={selectedFilial || ""}
              placeholder="Filial"
              onChange={(value) =>
                setSelectedFilial(value === "" ? undefined : value)
              }
              className="w-28 text-xs h-8 px-2 py-1"
            />
          </div>
          {!shouldApplyAgendaFilter(userRole) && (
            <div className="flex items-center">
              <Label className="mb-0 font-medium text-xs text-gray-700 dark:text-gray-200 whitespace-nowrap mr-2">
                Fisioterapeuta:
              </Label>
              <Select
                options={[{ label: "Todos", value: "" }, ...optionsFuncionario]}
                value={selectedFuncionario || ""}
                placeholder="Fisioterapeuta"
                onChange={(value) =>
                  setSelectedFuncionario(value === "" ? undefined : value)
                }
                className="w-36 text-xs h-8 px-2 py-1"
              />
            </div>
          )}
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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selectedEvent ? "Editar Evento" : "Novo Evento"}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Agende ou edite um evento e mantanha a clínica em ordem
                </p>
              </div>
              {selectedEvent && (
                <div className="flex items-center">
                  <button
                    onClick={handleDeleteEvent}
                    className="flex items-center justify-center w-12 h-12 mr-6 mt-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                    title="Excluir evento"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-red-500"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.54142 3.7915C6.54142 2.54886 7.54878 1.5415 8.79142 1.5415H11.2081C12.4507 1.5415 13.4581 2.54886 13.4581 3.7915V4.0415H15.6252H16.666C17.0802 4.0415 17.416 4.37729 17.416 4.7915C17.416 5.20572 17.0802 5.5415 16.666 5.5415H16.3752V8.24638V13.2464V16.2082C16.3752 17.4508 15.3678 18.4582 14.1252 18.4582H5.87516C4.63252 18.4582 3.62516 17.4508 3.62516 16.2082V13.2464V8.24638V5.5415H3.3335C2.91928 5.5415 2.5835 5.20572 2.5835 4.7915C2.5835 4.37729 2.91928 4.0415 3.3335 4.0415H4.37516H6.54142V3.7915ZM14.8752 13.2464V8.24638V5.5415H13.4581H12.7081H7.29142H6.54142H5.12516V8.24638V13.2464V16.2082C5.12516 16.6224 5.46095 16.9582 5.87516 16.9582H14.1252C14.5394 16.9582 14.8752 16.6224 14.8752 16.2082V13.2464ZM8.04142 4.0415H11.9581V3.7915C11.9581 3.37729 11.6223 3.0415 11.2081 3.0415H8.79142C8.37721 3.0415 8.04142 3.37729 8.04142 3.7915V4.0415ZM8.3335 7.99984C8.74771 7.99984 9.0835 8.33562 9.0835 8.74984V13.7498C9.0835 14.1641 8.74771 14.4998 8.3335 14.4998C7.91928 14.4998 7.5835 14.1641 7.5835 13.7498V8.74984C7.5835 8.33562 7.91928 7.99984 8.3335 7.99984ZM12.4168 8.74984C12.4168 8.33562 12.081 7.99984 11.6668 7.99984C11.2526 7.99984 10.9168 8.33562 10.9168 8.74984V13.7498C10.9168 14.1641 11.2526 14.4998 11.6668 14.4998C12.081 14.4998 12.4168 14.1641 12.4168 13.7498V8.74984Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-3">
                <div>
                  <Label>
                    Título Evento
                    <span className="text-red-300">*</span>
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
                  <Label>Descrição</Label>
                  <input
                    id="event-description"
                    type="text"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label>Localização</Label>
                  <input
                    id="event-location"
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              {/* Campos de data/hora - ocultos quando recorrência está ativa */}
              {(!isRecurrent || selectedEvent) && (
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-3">
                  <div>
                    <Label>
                      Data & Hora Início
                      <span className="text-red-300">*</span>
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
                    <Label>
                      Data & Hora Fim
                      <span className="text-red-300">*</span>
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
              )}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                <div>
                  <Label>Cliente</Label>
                  <Select
                    options={optionsCliente}
                    value={selectedCliente}
                    placeholder="Selecione um cliente"
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
                    value={modalFuncionario}
                    placeholder="Selecione um fisioterapeuta"
                    onChange={(value) =>
                      setModalFuncionario(value === "" ? undefined : value)
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
                    value={modalFilial}
                    placeholder="Selecione uma filial"
                    onChange={(value) =>
                      setModalFilial(value === "" ? undefined : value)
                    }
                    className="dark:bg-dark-900"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Status do Agendamento{" "}
                    <span className="text-red-300">*</span>
                  </Label>
                  <Select
                    options={statusOptions}
                    value={selectedStatus.toString()}
                    placeholder="Selecione o status"
                    onChange={(value) => setSelectedStatus(parseInt(value))}
                    className="dark:bg-dark-900"
                  />
                </div>
              </div>

              {/* Checkbox para recorrência - apenas para novos eventos ou edição de recorrência */}
              {(!selectedEvent || isEditingRecurrence) && (
                <div className="mb-5">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isRecurrent} onChange={setIsRecurrent} />
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      {selectedEvent && isEditingRecurrence
                        ? "Editar recorrência (alterará sessões futuras)"
                        : "Criar agendamento recorrente"}
                      {isRecurrent && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                          (Múltiplos agendamentos)
                        </span>
                      )}
                    </span>
                  </div>
                  {selectedEvent && isEditingRecurrence && (
                    <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                      ⚠️ Apenas sessões futuras (a partir de hoje) serão
                      alteradas. Sessões passadas permanecerão inalteradas.
                    </p>
                  )}
                </div>
              )}

              {/* Configuração de recorrência */}
              {isRecurrent && (
                <>
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h6 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Configuração de Recorrência
                    </h6>
                    {qtdSessoes > 0 &&
                      selectedDiasSemana &&
                      selectedDiasSemana.length > 0 && (
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Informação:</strong> Serão criados{" "}
                          {qtdSessoes} agendamentos alternando entre:{" "}
                          {selectedDiasSemana
                            .map((dia) => dia.toLowerCase())
                            .join(", ")}
                          {selectedHorarioRecorrente &&
                            ` às ${selectedHorarioRecorrente}`}
                          .
                        </p>
                      )}
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-5">
                    <div>
                      <MultiSelect
                        label="Dias da semana*"
                        options={[
                          { text: "Segunda-Feira", value: "Segunda-Feira" },
                          { text: "Terça-Feira", value: "Terça-Feira" },
                          { text: "Quarta-Feira", value: "Quarta-Feira" },
                          { text: "Quinta-Feira", value: "Quinta-Feira" },
                          { text: "Sexta-Feira", value: "Sexta-Feira" },
                          { text: "Sábado", value: "Sábado" },
                          { text: "Domingo", value: "Domingo" },
                        ]}
                        defaultSelected={selectedDiasSemana}
                        onChange={(selectedDays) => {
                          setSelectedDiasSemana(selectedDays);
                        }}
                      />
                    </div>
                    <div>
                      <Label>
                        Horário<span className="text-red-300">*</span>
                      </Label>
                      <input
                        type="time"
                        value={selectedHorarioRecorrente}
                        onChange={(e) =>
                          setSelectedHorarioRecorrente(e.target.value)
                        }
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                    <div>
                      <Label>
                        Qtd. Sessões<span className="text-red-300">*</span>
                      </Label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        value={qtdSessoes}
                        onChange={(e) =>
                          setQtdSessoes(parseInt(e.target.value) || 1)
                        }
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        placeholder="Ex: 10"
                      />
                    </div>
                  </div>
                </>
              )}

              <br></br>
              {/* Checkbox "Dia todo" - oculto quando recorrência está ativa */}
              {(!isRecurrent || selectedEvent) && (
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Dia todo
                  </span>
                </div>
              )}
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
                {selectedEvent
                  ? isEditingRecurrence && isRecurrent
                    ? "Atualizar Recorrência"
                    : "Atualizar"
                  : isRecurrent
                  ? "Criar Recorrência"
                  : "Salvar"}
              </button>
            </div>
          </div>
          <Toaster position="bottom-right" />
        </Modal>
        <Modal
          isOpen={isOpenDelete}
          onClose={closeModalDelete}
          className="max-w-[700px] m-4"
        >
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
                Excluir Evento
              </h4>
            </div>
            <form className="flex flex-col" onSubmit={handlePostDelete}>
              <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                <div>
                  <h5 className="mb-5 text-lg font-medium text-gray-800 text-center dark:text-white/90 lg:mb-6">
                    Tem certeza que deseja excluir este evento permanentemente?
                  </h5>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModalDelete}
                  className="flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                  type="submit"
                >
                  Excluir
                </button>
              </div>
            </form>
          </div>
          <Toaster position="bottom-right" />
        </Modal>
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60">
            <svg
              className="animate-spin h-12 w-12 text-brand-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;
