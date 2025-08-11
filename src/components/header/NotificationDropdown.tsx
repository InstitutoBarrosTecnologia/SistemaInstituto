import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Modal } from "../ui/modal";
import { useNotifications } from "../../hooks/useNotifications";
import { useSessionNotifications } from "../../hooks/useSessionNotifications";
import { NotificationResponseDto } from "../../services/model/Dto/Response/NotificationResponseDto";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(new Set());
  const [viewedSessions, setViewedSessions] = useState<Set<string>>(new Set());
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponseDto | null>(null);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook para notificações do sistema
  const {
    notifications,
    loading: notificationsLoading,
    error: notificationsError,
    loadNotifications,
  } = useNotifications({ 
    page: 1, 
    pageSize: 10 
  });

  // Hook para notificações de sessões
  const {
    notificationSessions,
    newSessionsCount,
    hasNewNotifications: hasNewSessions,
    isLoading: sessionsLoading,
    error: sessionsError,
    markAsRead,
    refetch: refetchSessions,
  } = useSessionNotifications();

  // Combinar as duas fontes de notificações e filtrar as visualizadas
  const activeNotifications = notifications.filter(notif => notif.ativo);
  const unviewedSystemNotifications = activeNotifications.filter(notif => !viewedNotifications.has(notif.id));
  const unviewedSessions = notificationSessions.filter(session => !viewedSessions.has(session.sessionId));
  
  const totalSystemNotifications = unviewedSystemNotifications.length;
  const totalUnviewedSessions = unviewedSessions.length;
  const totalNotifications = totalSystemNotifications + totalUnviewedSessions;
  const hasNewNotifications = totalSystemNotifications > 0 || hasNewSessions;
  const isLoading = notificationsLoading || sessionsLoading;

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    // Marcar sessões como lidas se houver sessões novas
    if (hasNewSessions) {
      markAsRead();
    }
  };

  // Função para atualizar ambas as fontes
  const handleRefresh = () => {
    loadNotifications();
    refetchSessions();
  };

  // Função para lidar com clique em notificação do sistema
  const handleNotificationClick = (notification: NotificationResponseDto) => {
    setSelectedNotification(notification);
    setSelectedSession(null);
    setViewedNotifications(prev => new Set(prev).add(notification.id));
    setIsModalOpen(true);
    closeDropdown();
  };

  // Função para lidar com clique em notificação de sessão
  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    setSelectedNotification(null);
    setViewedSessions(prev => new Set(prev).add(session.sessionId));
    setIsModalOpen(true);
    closeDropdown();
  };

  // Função para fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
    setSelectedSession(null);
  };

  // Função para formatar horário
  const formatTime = (timeString: string): string => {
    return timeString.substring(0, 5); // HH:MM
  };

  // Função para gerar iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Função para gerar cor baseada no status
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "agendada":
      case "agendado":
        return "bg-blue-500";
      case "realizada":
      case "concluída":
        return "bg-success-500";
      case "cancelada":
        return "bg-error-500";
      case "em andamento":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {/* Badge de notificação */}
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !hasNewNotifications ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>

        {/* Contador de notificações */}
        {(totalSystemNotifications > 0 || newSessionsCount > 0) && (
          <span className="absolute -top-1 -right-1 z-20 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {totalNotifications > 9 ? "9+" : totalNotifications}
          </span>
        )}

        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notificações ({totalNotifications})
          </h5>
          <div className="flex items-center gap-2">
            {/* Botão de refresh */}
            <button
              onClick={handleRefresh}
              className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title="Atualizar"
            >
              <svg
                className="fill-current w-4 h-4"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {/* Botão de fechar */}
            <button
              onClick={toggleDropdown}
              className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {isLoading && (
            <li className="flex items-center justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Carregando notificações...
              </span>
            </li>
          )}

          {(!!notificationsError || !!sessionsError) && (
            <li className="p-4 text-center">
              <div className="text-red-500 text-sm">
                Erro ao carregar notificações
              </div>
              <button
                onClick={handleRefresh}
                className="mt-2 text-xs text-blue-500 hover:text-blue-700"
              >
                Tentar novamente
              </button>
            </li>
          )}

          {!isLoading && !notificationsError && !sessionsError && activeNotifications.length === 0 && notificationSessions.length === 0 && (
            <li className="p-4 text-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma notificação
              </div>
            </li>
          )}

          {/* Notificações do Sistema */}
          {!isLoading &&
            !notificationsError &&
            activeNotifications.map((notification) => (
              <li key={`system-${notification.id}`}>
                <DropdownItem
                  onItemClick={() => handleNotificationClick(notification)}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer"
                >
                  {/* Ícone de notificação */}
                  <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                    <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-green-500 dark:border-gray-900"></span>
                  </span>

                  <span className="block flex-1">
                    <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {notification.titulo}
                      </span>
                    </span>

                    <span className="mb-1 block text-theme-xs text-gray-600 dark:text-gray-300">
                      {notification.mensagem}
                    </span>

                    <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500 text-white">
                        Sistema
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>
                        {new Date(notification.dataCriacao).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))}

          {/* Notificações de Sessões */}
          {!isLoading &&
            !sessionsError &&
            notificationSessions.map((session) => (
              <li key={`session-${session.sessionId}`}>
                <DropdownItem
                  onItemClick={() => handleSessionClick(session)}
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer ${
                    session.isNew ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  {/* Avatar com iniciais */}
                  <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getInitials(session.nomeCliente)}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white ${getStatusColor(
                        session.statusSessao
                      )} dark:border-gray-900`}
                    ></span>
                  </span>

                  <span className="block flex-1">
                    <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {session.nomeFuncionario}
                      </span>
                      <span>
                        fez check-in às {formatTime(session.horaSessao)}
                      </span>
                      {session.isNew && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 ml-2">
                          Nova
                        </span>
                      )}
                    </span>

                    <span className="mb-1 block text-theme-xs text-gray-600 dark:text-gray-300">
                      Paciente: {session.nomeCliente}
                    </span>

                    {session.observacaoSessao && (
                      <span className="mb-1 block text-theme-xs text-gray-500 dark:text-gray-400 italic">
                        "{session.observacaoSessao}"
                      </span>
                    )}

                    <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                          session.statusSessao
                        )} text-white`}
                      >
                        {session.statusSessao}
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{session.timeAgo}</span>
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))}
        </ul>
      </Dropdown>

      {/* Modal para exibir detalhes da notificação */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          {selectedNotification && (
            <>
              <div className="px-2 pr-14 mb-6">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  {selectedNotification.titulo}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Notificação do Sistema
                </p>
              </div>

              <div className="space-y-4 px-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mensagem:
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-900 dark:text-white">
                      {selectedNotification.mensagem}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status:
                    </label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      selectedNotification.ativo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {selectedNotification.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Criado em:
                    </label>
                    <p className="text-gray-900 dark:text-white text-sm">
                      {new Date(selectedNotification.dataCriacao).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                {selectedNotification.dataExpiracao && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expira em:
                    </label>
                    <p className="text-gray-900 dark:text-white text-sm">
                      {new Date(selectedNotification.dataExpiracao).toLocaleString("pt-BR")}
                    </p>
                  </div>
                )}

                {selectedNotification.usrDescricaoCadastro && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Criado por:
                    </label>
                    <p className="text-gray-900 dark:text-white text-sm">
                      {selectedNotification.usrDescricaoCadastro}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedSession && (
            <>
              <div className="px-2 pr-14 mb-6">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Check-in de Sessão
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Notificação de Fisioterapia
                </p>
              </div>

              <div className="space-y-4 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fisioterapeuta:
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedSession.nomeFuncionario}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Paciente:
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedSession.nomeCliente}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Horário da Sessão:
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {formatTime(selectedSession.horaSessao)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status:
                    </label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedSession.statusSessao)}`}>
                      {selectedSession.statusSessao}
                    </span>
                  </div>
                </div>

                {selectedSession.observacaoSessao && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observações:
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-900 dark:text-white italic">
                        "{selectedSession.observacaoSessao}"
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recebido:
                  </label>
                  <p className="text-gray-900 dark:text-white text-sm">
                    {selectedSession.timeAgo}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 px-2 mt-6">
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white shadow-theme-xs hover:bg-gray-600 disabled:bg-gray-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
