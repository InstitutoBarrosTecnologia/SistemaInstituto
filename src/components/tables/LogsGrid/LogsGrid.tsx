import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { useLogs } from "../../../hooks/useLogs";
import { LogFilters } from "../../../pages/Logs/Logs";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

interface LogsGridProps {
  filters?: LogFilters;
}

export default function LogsGrid({ filters }: LogsGridProps) {
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const {
    isOpen: isOpenDetails,
    openModal: openModalDetails,
    closeModal: closeModalDetails,
  } = useModal();

  // Hook personalizado para buscar logs
  const { logs: apiLogs, isLoading, isError } = useLogs(filters);

  // Dados mockados para teste
  const mockLogs = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      ip: "192.168.1.100",
      dispositivo: "Chrome 120.0 / Windows 10",
      dataInsercao: new Date().toISOString(),
      localizacao: "São Paulo, SP - Brasil",
      titulo: "Login realizado com sucesso",
      descricao: "Usuário admin realizou login no sistema via navegador Chrome",
      nivel: 0, // Info
      jornadaCritica: false,
      usrAcao: "123e4567-e89b-12d3-a456-426614174000",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      ip: "192.168.1.101",
      dispositivo: "Firefox 121.0 / macOS",
      dataInsercao: new Date(Date.now() - 3600000).toISOString(),
      localizacao: "Rio de Janeiro, RJ - Brasil",
      titulo: "Tentativa de acesso não autorizado",
      descricao: "Tentativa de acesso ao módulo financeiro sem permissão adequada",
      nivel: 1, // Warning
      jornadaCritica: true,
      usrAcao: "223e4567-e89b-12d3-a456-426614174001",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      ip: "192.168.1.102",
      dispositivo: "Safari 17.0 / iOS 17",
      dataInsercao: new Date(Date.now() - 7200000).toISOString(),
      localizacao: "Belo Horizonte, MG - Brasil",
      titulo: "Erro ao processar requisição",
      descricao: "Erro 500 ao tentar carregar lista de pacientes - Timeout na conexão com banco de dados",
      nivel: 2, // Error
      jornadaCritica: true,
      usrAcao: "323e4567-e89b-12d3-a456-426614174002",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      ip: "192.168.1.103",
      dispositivo: "Edge 120.0 / Windows 11",
      dataInsercao: new Date(Date.now() - 10800000).toISOString(),
      localizacao: "Curitiba, PR - Brasil",
      titulo: "Falha crítica no sistema de agendamento",
      descricao: "Sistema de agendamento apresentou falha crítica durante criação de múltiplos eventos simultâneos",
      nivel: 3, // Fatal
      jornadaCritica: true,
      usrAcao: "423e4567-e89b-12d3-a456-426614174003",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      ip: "192.168.1.104",
      dispositivo: "Chrome 120.0 / Android 14",
      dataInsercao: new Date(Date.now() - 14400000).toISOString(),
      localizacao: "Porto Alegre, RS - Brasil",
      titulo: "Relatório gerado com sucesso",
      descricao: "Relatório financeiro do mês de outubro foi gerado e enviado por e-mail",
      nivel: 0, // Info
      jornadaCritica: false,
      usrAcao: "523e4567-e89b-12d3-a456-426614174004",
    },
  ];

  // Usar dados mockados se não houver dados da API (para teste)
  const logs = apiLogs && apiLogs.length > 0 ? apiLogs : mockLogs;

  // Debug para verificar os dados
  console.log("📊 LogsGrid - Dados:", { apiLogs, mockLogs, logs, isLoading, isError });

  const handleOpenModalDetails = (log: any) => {
    setSelectedLog(log);
    openModalDetails();
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

  // Removido verificação de erro e vazio para sempre mostrar os dados mockados durante desenvolvimento

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

        {/* Rodapé da Tabela */}
        <div className="border-t border-gray-100 px-5 py-3 dark:border-white/[0.05]">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Mostrando {logs.length} {logs.length === 1 ? "registro" : "registros"}
            </span>
            {/* Paginação pode ser adicionada aqui se necessário */}
          </div>
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
