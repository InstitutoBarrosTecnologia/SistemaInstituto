import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useSessionNotifications } from "../../hooks/useSessionNotifications";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notificationSessions,
    newSessionsCount,
    hasNewNotifications,
    isLoading,
    error,
    markAsRead,
    refetch,
    totalSessions,
  } = useSessionNotifications();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    if (hasNewNotifications) {
      markAsRead();
    }
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
        {newSessionsCount > 0 && (
          <span className="absolute -top-1 -right-1 z-20 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {newSessionsCount > 9 ? "9+" : newSessionsCount}
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
            Notificações ({totalSessions})
          </h5>
          <div className="flex items-center gap-2">
            {/* Botão de refresh */}
            <button
              onClick={refetch}
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
                Carregando sessões...
              </span>
            </li>
          )}

          {!!error && (
            <li className="p-4 text-center">
              <div className="text-red-500 text-sm">
                Erro ao carregar sessões
              </div>
              <button
                onClick={refetch}
                className="mt-2 text-xs text-blue-500 hover:text-blue-700"
              >
                Tentar novamente
              </button>
            </li>
          )}

          {!isLoading && !error && notificationSessions.length === 0 && (
            <li className="p-4 text-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma notificação
              </div>
            </li>
          )}

          {!isLoading &&
            !error &&
            notificationSessions.map((session) => (
              <li key={session.sessionId}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 ${
                    session.isNew ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  {/* Avatar com iniciais */}
                  <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
    </div>
  );
}
