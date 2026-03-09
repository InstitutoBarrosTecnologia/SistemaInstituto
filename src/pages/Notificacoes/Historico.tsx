import { useState } from "react";
import { Toaster } from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { TimeIcon } from "../../icons";
import { useNotificationHistory } from "../../hooks/useNotificationHistory";
import { NotificationResponseDto } from "../../services/model/Dto/Response/NotificationResponseDto";
import NotificationHistoryFilters from "./components/NotificationHistoryFilters";
import NotificationDetailModal from "./components/NotificationDetailModal";
import { getUserRoleFromToken, USER_ROLES, userHasRole } from "../../services/util/rolePermissions";

export default function Historico() {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Filtros aplicados (separados dos filtros de input)
  const [appliedFilters, setAppliedFilters] = useState<{
    searchText: string;
    startDate: string;
    endDate: string;
    status?: boolean;
    page: number;
    pageSize: number;
  }>({
    searchText: "",
    startDate: "",
    endDate: "",
    page: 1,
    pageSize: pageSize,
  });

  // Modal
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obter role do usuário
  const userRoles = getUserRoleFromToken(localStorage.getItem("token"));
  const isAdmin = userHasRole(userRoles, USER_ROLES.ADMINISTRADOR);
  const isAdministrativo = userHasRole(userRoles, USER_ROLES.ADMINISTRATIVO);
  const hasFullAccess = isAdmin || isAdministrativo;

  // Hook para buscar histórico
  const { notifications, loading, error, pagination } = useNotificationHistory(appliedFilters);

  const handleApplyFilters = () => {
    const parsedStatus = status === "" ? undefined : status === "true";
    
    setAppliedFilters({
      searchText: searchText.trim(),
      startDate: startDate,
      endDate: endDate,
      status: parsedStatus as any,
      page: 1,
      pageSize: pageSize,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setAppliedFilters({
      searchText: "",
      startDate: "",
      endDate: "",
      page: 1,
      pageSize: pageSize,
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (notification: NotificationResponseDto) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setAppliedFilters({
      ...appliedFilters,
      page: newPage,
    });
  };

  const totalPages = Math.ceil(pagination.totalCount / pageSize);

  return (
    <>
      <PageMeta
        title="Histórico de Notificações"
        description={hasFullAccess 
          ? "Visualize o histórico completo de todas as notificações enviadas no sistema" 
          : "Visualize o histórico das notificações que você recebeu"}
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Histórico de Notificações" />

        {/* Header Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
              <TimeIcon className="text-purple-600 size-6 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Histórico de Notificações
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {hasFullAccess 
                  ? "Visualize todas as notificações enviadas no sistema" 
                  : "Visualize as notificações que você recebeu"}
              </p>
            </div>
          </div>

          {/* Info Badge */}
          {hasFullAccess && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Você tem acesso completo ao histórico de todas as notificações do sistema.
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <NotificationHistoryFilters
          searchText={searchText}
          startDate={startDate}
          endDate={endDate}
          status={status}
          onSearchTextChange={setSearchText}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onStatusChange={setStatus}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          loading={loading}
        />

        {/* Results Table */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Resultados
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {pagination.totalCount > 0 
                ? `${pagination.totalCount} notificação(ões) encontrada(s)` 
                : "Nenhuma notificação encontrada"}
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Carregando histórico...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Erro: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <Table className="table-auto">
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                        >
                          Título
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                        >
                          Mensagem
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                        >
                          Status
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                        >
                          Data de Criação
                        </TableCell>
                        {hasFullAccess && (
                          <TableCell
                            isHeader
                            className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                          >
                            Criado por
                          </TableCell>
                        )}
                        <TableCell
                          isHeader
                          className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                        >
                          Ações
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {Array.isArray(notifications) && notifications.length > 0
                        ? notifications.map((notification) => (
                            <TableRow key={notification.id}>
                              <TableCell className="px-4 py-3 text-start">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {notification.titulo}
                                </span>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <span className="block text-gray-500 text-theme-sm dark:text-gray-400 max-w-xs truncate">
                                  {notification.mensagem}
                                </span>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <Badge
                                  size="sm"
                                  color={notification.ativo ? "success" : "error"}
                                >
                                  {notification.ativo ? "Ativa" : "Inativa"}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {formatDate(notification.dataCriacao)}
                              </TableCell>
                              {hasFullAccess && (
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                  {notification.usrDescricaoCadastro || "N/A"}
                                </TableCell>
                              )}
                              <TableCell className="px-4 py-3">
                                <button
                                  onClick={() => handleViewDetails(notification)}
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  Ver Detalhes
                                </button>
                              </TableCell>
                            </TableRow>
                          ))
                        : null}
                    </TableBody>
                  </Table>

                  {(!Array.isArray(notifications) ||
                    notifications.length === 0) &&
                    !loading && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhuma notificação encontrada com os filtros aplicados.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Toast Container */}
      <Toaster position="bottom-right" />
    </>
  );
}
