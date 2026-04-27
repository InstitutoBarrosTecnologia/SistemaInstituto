import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal";
import Message from "../../whatsapp/message";
import { useModal } from "../../../hooks/useModal";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  getConversas,
  getMensagens,
  marcarComoLida,
} from "../../../services/WhatsappService";
import type {
  WhatsappConversationResponseDto,
  WhatsappMessageResponseDto,
} from "../../../services/model/WhatsappTypes";
import { statusColor, statusLabel } from "../../../services/model/WhatsappTypes";

const POLLING_INTERVAL_MS = 30_000;

export default function WhatsappTableLeadComponent() {
  const { isOpen: viewModalOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [conversas, setConversas] = useState<WhatsappConversationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversa, setSelectedConversa] = useState<WhatsappConversationResponseDto | null>(null);
  const [mensagens, setMensagens] = useState<WhatsappMessageResponseDto[]>([]);
  const [loadingMensagens, setLoadingMensagens] = useState(false);

  const fetchConversas = useCallback(async () => {
    try {
      const data = await getConversas();
      setConversas(data);
    } catch {
      // silencia erro de polling
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversas();
    const interval = setInterval(fetchConversas, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchConversas]);

  const handleOpenModal = async (conversa: WhatsappConversationResponseDto) => {
    setSelectedConversa(conversa);
    setLoadingMensagens(true);
    openViewModal();

    try {
      const msgs = await getMensagens(conversa.id);
      setMensagens(msgs);
      // Marcar como lida
      await marcarComoLida(conversa.id);
      // Atualizar contador localmente
      setConversas((prev) =>
        prev.map((c) =>
          c.id === conversa.id ? { ...c, mensagensNaoLidas: 0 } : c
        )
      );
    } catch {
      setMensagens([]);
    } finally {
      setLoadingMensagens(false);
    }
  };

  const handleCloseModal = () => {
    closeViewModal();
    setSelectedConversa(null);
    setMensagens([]);
  };

  // Paginação
  const paginatedData = useMemo(() => {
    return conversas.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [conversas, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(conversas.length / itemsPerPage);
  }, [conversas.length, itemsPerPage]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        Carregando conversas...
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="table-auto">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Contato
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Telefone
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Última Atividade
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Não Lidas
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>
                    Nenhuma conversa encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-200 font-medium">
                      <div>{item.nomeContato ?? item.nrTelefoneCliente}</div>
                      {item.nomeCliente && (
                        <div className="text-xs text-gray-400">{item.nomeCliente}</div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.nrTelefoneCliente}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color={statusColor[item.status] ?? "light"}>
                        {statusLabel[item.status] ?? item.statusDescricao}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(item.ultimaAtividade)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {item.mensagensNaoLidas > 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                          {item.mensagensNaoLidas}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:hover:bg-white/[0.03] dark:hover:text-blue-200"
                        title="Ver mensagens"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6.663 3.116 1.805 4.172m-7.155 0A8.25 8.25 0 1 1 15.75 8.25M9.75 17.1m6.802-4.991a.75.75 0 0 0-1.225-.981m-.78.185a.75.75 0 0 0-1.06-1.061M12 18.75a6 6 0 0 1-6-6m6 6a6 6 0 0 0 6-6m-6 6v3.75m0-3.75h3.75" />
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Modal isOpen={viewModalOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {selectedConversa?.nomeContato ?? selectedConversa?.nrTelefoneCliente ?? "Conversa"}
            </h4>
            {selectedConversa?.nomeCliente && (
              <p className="text-sm text-gray-400 mb-1">
                Cliente: {selectedConversa.nomeCliente}
              </p>
            )}
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {selectedConversa?.tipoAtendimentoDescricao} · {selectedConversa?.statusDescricao}
            </p>
          </div>
          {loadingMensagens ? (
            <div className="flex items-center justify-center p-8 text-gray-400">
              Carregando mensagens...
            </div>
          ) : (
            <Message messages={mensagens} />
          )}
        </div>
      </Modal>
    </>
  );
}
