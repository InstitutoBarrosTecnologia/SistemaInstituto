import { useState } from "react";
import { DataGridBase, DataGridColumn, DataGridAction } from "../../DataGrid/DataGridBase";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../stores/modalStore";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { useLogs } from "../../../hooks/useLogs";
import { LogFilters } from "../../../pages/Log/Log";

interface LogsGridProps {
  filters?: LogFilters;
}

interface Log {
  id?: string;
  dataInsercao: string;
  titulo: string;
  descricao?: string;
  usrAcao: string;
  nivel: number;
  jornadaCritica: boolean;
  ip: string;
  dispositivo?: string;
  localizacao?: string;
}

export default function LogsGrid({ filters }: LogsGridProps) {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const _pageSize = 10;

  const {
    isOpen: isOpenDetails,
    open: openDetails,
    close: closeDetails,
  } = useModal('viewLog');

  // Buscar TODOS os logs da API (sem paginação backend)
  const filtersForApi: LogFilters = {
    page: 1,
    pageSize: 9999, // Buscar todos os registros
  };

  // Hook personalizado para buscar logs
  const { logs: allLogs, isLoading, isError } = useLogs(filtersForApi);

  // Aplicar filtros no frontend
  const filteredLogs = allLogs.filter((log: any) => {
    // Filtro por IP
    if (filters?.ip && !log.ip?.toLowerCase().includes(filters.ip.toLowerCase())) {
      return false;
    }

    // Filtro por Nível
    if (
      filters?.nivel !== null &&
      filters?.nivel !== undefined &&
      log.nivel !== filters.nivel
    ) {
      return false;
    }

    // Filtro por Jornada Crítica
    if (
      filters?.jornadaCritica !== null &&
      filters?.jornadaCritica !== undefined &&
      log.jornadaCritica !== filters.jornadaCritica
    ) {
      return false;
    }

    // Filtro por Data Início
    if (filters?.dataInicio) {
      // Extrair apenas a data (yyyy-mm-dd) sem hora
      const logDateStr = log.dataInsercao?.split("T")[0];
      const filterDateStr = filters.dataInicio;

      if (logDateStr < filterDateStr) {
        return false;
      }
    }

    // Filtro por Data Fim
    if (filters?.dataFim) {
      // Extrair apenas a data (yyyy-mm-dd) sem hora
      const logDateStr = log.dataInsercao?.split("T")[0];
      const filterDateStr = filters.dataFim;

      if (logDateStr > filterDateStr) {
        return false;
      }
    }

    // Filtro por Usuário (Guid)
    if (
      filters?.usrAcao &&
      !log.usrAcao?.toLowerCase().includes(filters.usrAcao.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

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

  const columns: DataGridColumn<Log>[] = [
    {
      key: "dataInsercao",
      label: "Data/Hora",
      render: (_value, row) => formatDateTime(row.dataInsercao),
    },
    {
      key: "titulo",
      label: "Título",
      render: (_value, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.titulo || "-"}</span>
          {row.descricao && (
            <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {row.descricao}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "usrAcao",
      label: "Usuário (ID)",
      render: (_value, row) => (
        <code className="text-xs">{row.usrAcao ? row.usrAcao.substring(0, 8) + "..." : "-"}</code>
      ),
    },
    {
      key: "nivel",
      label: "Nível",
      render: (_value, row) => getNivelBadge(row.nivel),
    },
    {
      key: "jornadaCritica",
      label: "Jornada Crítica",
      render: (_value, row) => (
        <Badge color={row.jornadaCritica ? "error" : "light"}>
          {row.jornadaCritica ? "Sim" : "Não"}
        </Badge>
      ),
    },
    {
      key: "ip",
      label: "IP",
      render: (_value, row) => <code className="text-xs">{row.ip || "-"}</code>,
    },
  ];

  const actions: DataGridAction<Log>[] = [
    {
      id: "details",
      label: "Detalhes",
      onClick: (item) => {
        setSelectedLog(item);
        openDetails(item);
      },
    },
  ];

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-white font-semibold">
            Erro ao carregar logs
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Não foi possível buscar os dados. Tente novamente.
          </p>
        </div>
      </div>
    );

  return (
    <>
      <DataGridBase<any>
        config={{
          columns,
          data: filteredLogs || [],
          actions,
          itemsPerPage: _pageSize,
          loading: isLoading,
          error: isError ? "Erro ao carregar logs" : undefined,
          emptyMessage: "Nenhum log encontrado",
        }}
      />

      {/* Modal de Detalhes do Log */}
      <Modal isOpen={isOpenDetails} onClose={closeDetails} className="max-w-3xl">
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
              onClick={closeDetails}
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
            <Button onClick={closeDetails} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
