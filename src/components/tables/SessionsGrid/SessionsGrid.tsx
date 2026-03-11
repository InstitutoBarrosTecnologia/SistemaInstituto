import { useState } from "react";
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
import { useSessions } from "../../../hooks/useSessions";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { ESessionStatus } from "../../../services/model/Enum/ESessionStatus";
import { OrderServiceSessionResponseDto } from "../../../services/model/Dto/Response/OrderServiceSessionResponseDto";
import { format, subDays } from "date-fns";

export default function SessionsGrid() {
  // Estados de filtros
  const [dataInicio, setDataInicio] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [dataFim, setDataFim] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paciente, setPaciente] = useState("");
  const [fisioterapeuta, setFisioterapeuta] = useState("");
  const [status, setStatus] = useState("");
  const [ordemServico, setOrdemServico] = useState("");

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal de exclusão
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedSession, setSelectedSession] =
    useState<OrderServiceSessionResponseDto | null>(null);

  // Hook de sessões
  const { sessions, isLoading, deleteSession, isDeleting } = useSessions();

  // Funções auxiliares
  const getStatusLabel = (status: ESessionStatus) => {
    const labels = {
      [ESessionStatus.Realizada]: "Realizada",
      [ESessionStatus.Faltou]: "Faltou",
      [ESessionStatus.Reagendada]: "Reagendada",
      [ESessionStatus.Cancelada]: "Cancelada",
    };
    return labels[status] || "Desconhecido";
  };

  const getStatusColor = (status: ESessionStatus) => {
    const colors = {
      [ESessionStatus.Realizada]: "success",
      [ESessionStatus.Faltou]: "error",
      [ESessionStatus.Reagendada]: "warning",
      [ESessionStatus.Cancelada]: "default",
    };
    return colors[status] || "default";
  };

  const formatDateTime = (data: string, hora: string) => {
    try {
      const date = new Date(data);
      return `${date.toLocaleDateString("pt-BR")} às ${hora.substring(0, 5)}`;
    } catch {
      return `${data} às ${hora}`;
    }
  };

  // Filtrar sessões
  const filteredSessions = sessions.filter((session: any) => {
    const sessionDate = new Date(session.dataSessao);
    const startDate = new Date(dataInicio);
    const endDate = new Date(dataFim);
    endDate.setHours(23, 59, 59, 999);

    const matchesDate =
      sessionDate >= startDate && sessionDate <= endDate;
    const matchesPaciente =
      !paciente ||
      session.cliente?.nome?.toLowerCase().includes(paciente.toLowerCase());
    const matchesFisio =
      !fisioterapeuta ||
      session.funcionario?.nome?.toLowerCase().includes(fisioterapeuta.toLowerCase());
    const matchesStatus = !status || session.statusSessao === parseInt(status);
    const matchesOrdem =
      !ordemServico ||
      session.orderServiceId?.toLowerCase().includes(ordemServico.toLowerCase());

    return (
      matchesDate &&
      matchesPaciente &&
      matchesFisio &&
      matchesStatus &&
      matchesOrdem
    );
  });

  // Paginação
  const totalPages = Math.ceil(filteredSessions.length / pageSize);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDeleteModal = (session: OrderServiceSessionResponseDto) => {
    setSelectedSession(session);
    openModal();
  };

  const handleDelete = () => {
    if (selectedSession?.id) {
      deleteSession(selectedSession.id);
      closeModal();
      setSelectedSession(null);
    }
  };

  const handleClearFilters = () => {
    setDataInicio(format(subDays(new Date(), 30), "yyyy-MM-dd"));
    setDataFim(format(new Date(), "yyyy-MM-dd"));
    setPaciente("");
    setFisioterapeuta("");
    setStatus("");
    setOrdemServico("");
    setCurrentPage(1);
  };

  return (
    <>
      {/* Filtros */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Filtros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="0">Realizada</option>
              <option value="1">Faltou</option>
              <option value="2">Reagendada</option>
              <option value="3">Cancelada</option>
            </select>
          </div>

          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paciente
            </label>
            <input
              type="text"
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Fisioterapeuta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fisioterapeuta
            </label>
            <input
              type="text"
              value={fisioterapeuta}
              onChange={(e) => setFisioterapeuta(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Ordem de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordem de Serviço
            </label>
            <input
              type="text"
              value={ordemServico}
              onChange={(e) => setOrdemServico(e.target.value)}
              placeholder="Buscar por ID..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <Button onClick={handleClearFilters} variant="outline">
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Check-ins Registrados
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredSessions.length > 0
              ? `${filteredSessions.length} check-in(s) encontrado(s)`
              : "Nenhum check-in encontrado"}
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Carregando check-ins...
            </p>
          </div>
        )}

        {!isLoading && filteredSessions.length > 0 && (
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
                        Paciente
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Fisioterapeuta
                      </TableCell>
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
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Observação
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Ações
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedSessions.map((session: any) => (
                      <TableRow key={session.id}>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {session.cliente?.nome || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="block text-gray-500 text-theme-sm dark:text-gray-400">
                            {session.funcionario?.nome || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="block text-gray-500 text-theme-sm dark:text-gray-400">
                            {formatDateTime(
                              session.dataSessao,
                              session.horaSessao
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(session.statusSessao) as any}
                          >
                            {getStatusLabel(session.statusSessao)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className="block text-gray-500 text-theme-sm dark:text-gray-400 max-w-xs truncate">
                            {session.observacaoSessao || "-"}
                          </span>
                        </TableCell>
                         <TableCell className="px-4 py-3">
                           <Button
                             onClick={() => handleOpenDeleteModal(session)}
                             variant="outline"
                             size="sm"
                           >
                             Excluir
                           </Button>
                         </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={pageSize}
                totalItems={filteredSessions.length}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {!isLoading && filteredSessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum check-in encontrado com os filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="space-y-4">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Confirmar Exclusão
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tem certeza que deseja excluir este check-in?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-2">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            {selectedSession && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mx-2">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Fisioterapeuta:
                    </strong>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {selectedSession.funcionario?.nome || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Data/Hora:
                    </strong>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDateTime(
                        selectedSession.dataSessao,
                        selectedSession.horaSessao
                      )}
                    </span>
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Status:
                    </strong>{" "}
                    <Badge
                      size="sm"
                      color={
                        getStatusColor(selectedSession.statusSessao) as any
                      }
                    >
                      {getStatusLabel(selectedSession.statusSessao)}
                    </Badge>
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 px-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="flex-1 h-11 text-text-secondary border border-border-secondary hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
