import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Pagination,
} from "../../ui/table";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import { useState, useEffect } from "react";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { useLogs } from "../../../hooks/useLogs";
import { LogFilters } from "../../../pages/Log/Log";

interface LogsGridProps {
  filters?: LogFilters;
}

export default function LogsGrid({ filters }: LogsGridProps) {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const {
    isOpen: isOpenDetails,
    openModal: openModalDetails,
    closeModal: closeModalDetails,
  } = useModal();

  // Resetar página quando os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Mesclar filtros com paginação atual
  const filtersWithPagination: LogFilters = {
    ...filters,
    page: currentPage,
    pageSize: pageSize,
  };

  // Hook personalizado para buscar logs
  const { logs, pagination, isLoading, isError } = useLogs(filtersWithPagination);

  const handleOpenModalDetails = (log: any) => {
    setSelectedLog(log);
    openModalDetails();
  };

  // Handler para mudança de página
  const handlePageChange = (newPage: number) => {
    if (!isNaN(newPage) && newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  // Função para obter badge de nível (criticidade)
  const getNivelBadge = (nivel: number) => {
    const badges: Record<number, { color: any; label: string }> = {
      0: { color: "info", label: "Info" },
      1: { color: "warning", label: "Warning" },
      2: { color: "error", label: "Error" },
      3: { color: "error", label: "Fatal" },
    };

    const config = badges[nivel] || { color: "primary", label: `Nível ${nivel}` };
    return <Badge color={config.color}>{config.label}</Badge>;
  };

  // Função para formatar data
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Carregando logs...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-white font-semibold">Erro ao carregar logs</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Não foi possível buscar os dados. Tente novamente.
          </p>
        </div>
      </div>
    );

  if (!logs || logs.length === 0)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-white font-semibold">Nenhum log encontrado</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Não há registros para exibir com os filtros aplicados.
          </p>
        </div>
      </div>
    );

  return (
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
                  Data/Hora
                </TableCell>
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
                  Usuário (ID)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Nível
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Jornada Crítica
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  IP
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Ações
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log: any) => (
                <TableRow
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-5 py-3 text-start text-theme-xs font-normal text-gray-800 dark:text-white/90">
                    {formatDateTime(log.dataInsercao)}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-theme-xs font-normal text-gray-800 dark:text-white/90">
                    <div className="flex flex-col">
                      <span className="font-medium">{log.titulo || "-"}</span>
                      {log.descricao && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {log.descricao}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-theme-xs font-normal text-gray-600 dark:text-gray-400">
                    <code className="text-xs">{log.usrAcao ? log.usrAcao.substring(0, 8) + "..." : "-"}</code>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-theme-xs font-normal text-gray-800 dark:text-white/90">
                    {getNivelBadge(log.nivel)}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-theme-xs font-normal text-gray-800 dark:text-white/90">
                    <Badge color={log.jornadaCritica ? "error" : "light"}>
                      {log.jornadaCritica ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-theme-xs font-normal text-gray-600 dark:text-gray-400">
                    <code className="text-xs">{log.ip || "-"}</code>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start text-theme-xs font-normal text-gray-800 dark:text-white/90">
                    <Button
                      onClick={() => handleOpenModalDetails(log)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Rodapé da Tabela com Paginação */}
        <div className="border-t border-gray-100 dark:border-white/[0.05]">
          {pagination ? (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
            />
          ) : (
            <div className="px-5 py-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Mostrando {logs.length} {logs.length === 1 ? "registro" : "registros"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Log */}
      <Modal isOpen={isOpenDetails} onClose={closeModalDetails} className="max-w-3xl">
        <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalhes do Log
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Informações completas do registro de log
              </p>
            </div>
            <button
              onClick={closeModalDetails}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Data de Inserção
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDateTime(selectedLog.dataInsercao)}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Nível
                  </p>
                  <div className="mt-1">{getNivelBadge(selectedLog.nivel)}</div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    ID do Usuário
                  </p>
                  <code className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedLog.usrAcao || "-"}
                  </code>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Endereço IP
                  </p>
                  <code className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedLog.ip || "-"}
                  </code>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Dispositivo
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedLog.dispositivo || "-"}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Localização
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedLog.localizacao || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Jornada Crítica
                </p>
                <Badge color={selectedLog.jornadaCritica ? "error" : "light"}>
                  {selectedLog.jornadaCritica ? "Sim" : "Não"}
                </Badge>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Título
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedLog.titulo || "-"}
                </p>
              </div>

              {selectedLog.descricao && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Descrição
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedLog.descricao}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={closeModalDetails} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
