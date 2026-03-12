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
import { GroupMessage } from "../../../services/model/GroupMessage";
import { useModal } from "../../../hooks/useModal";
import { useState, useMemo } from "react";

interface WhatsappMessage {
  id: string;
  name: string;
  phoneNumber: string;
  status: string;
  dateNumber: string;
  service: string;
}

export default function WhatsappTableLeadComponent() {
  const { isOpen: viewModalOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const group: GroupMessage = {
    id: {
      timestamp: 1743381095,
      creationTime: "2025-03-31T00:31:35.485Z",
    },
    phoneNumber: "551199999999",
    dateConversation: "2025-03-31",
    conversationId: "92a3fdf0-e3b2-4f73-9c87-ae261dd29494",
    messages: [
      {
        id: "a7bba079-ab94-4140-96b3-862903793104",
        fromUser: "551150396001",
        toUser: "551199999999",
        date: "2025-03-31T00:31:35.485Z",
        text: "Olá! Tudo bem por aí?",
      },
      {
        id: "8755a5fe-2bc5-4dcb-8ca7-6dfd027ea589",
        fromUser: "551199999999",
        toUser: "551150396001",
        date: "2025-03-31T00:36:35.485Z",
        text: "Sim, tudo certo e por aí?",
      },
      {
        id: "8675890c-ad15-41df-ba00-7c92d9691300",
        fromUser: "551150396001",
        toUser: "551199999999",
        date: "2025-03-31T00:41:35.485Z",
        text: "Também! Estou entrando em contato para falar sobre aquela proposta.",
      },
      {
        id: "255a6d38-af27-4a51-883d-ea27bb27d4bd",
        fromUser: "551199999999",
        toUser: "551150396001",
        date: "2025-03-31T00:46:35.485Z",
        text: "Claro, estou à disposição.",
      },
      {
        id: "cb813fb7-f5d4-454f-9478-0acceab006e0",
        fromUser: "551150396001",
        toUser: "551199999999",
        date: "2025-03-31T00:51:35.485Z",
        text: "Você poderia me enviar os detalhes por e-mail?",
      },
      {
        id: "c6cf93ab-a6ab-4b06-a927-202a92be584e",
        fromUser: "551199999999",
        toUser: "551150396001",
        date: "2025-03-31T00:56:35.485Z",
        text: "Posso sim, vou providenciar agora.",
      },
      {
        id: "488b2258-0972-4d1e-9336-98d110841f2f",
        fromUser: "551150396001",
        toUser: "551199999999",
        date: "2025-03-31T01:01:35.485Z",
        text: "Aguardo então. Obrigado!",
      },
      {
        id: "62b33ea3-b053-48b5-81ba-84c3bc370458",
        fromUser: "551199999999",
        toUser: "551150396001",
        date: "2025-03-31T01:06:35.485Z",
        text: "Disponha! Qualquer dúvida é só chamar.",
      },
    ],
  };

  const tableData: WhatsappMessage[] = [
    {
      id: "1",
      name: "Carlos Silva",
      phoneNumber: "(11) 91234-5678",
      status: "Novo",
      dateNumber: "2024-03-15 10:30",
      service: "Liberação Miofacial",
    },
    {
      id: "2",
      name: "Fernanda Lopes",
      phoneNumber: "(21) 99876-5432",
      status: "Não Lido",
      dateNumber: "2024-03-15 14:20",
      service: "Recovery",
    },
    {
      id: "3",
      name: "João Mendes",
      phoneNumber: "(31) 93456-7890",
      status: "Respondido",
      dateNumber: "2024-03-14 09:15",
      service: "Lesão",
    },
    {
      id: "4",
      name: "Luciana Prado",
      phoneNumber: "(51) 98765-4321",
      status: "Cancelado",
      dateNumber: "2024-03-13 11:45",
      service: "Não Identificado",
    },
    {
      id: "5",
      name: "Marcelo Araújo",
      phoneNumber: "(41) 92345-6789",
      status: "Cancelado",
      dateNumber: "2024-03-12 16:00",
      service: "Não Identificado",
    },
    {
      id: "6",
      name: "Patrícia Ferreira",
      phoneNumber: "(61) 99988-7766",
      status: "Respondido",
      dateNumber: "2024-03-11 17:50",
      service: "Reclamação",
    },
    {
      id: "7",
      name: "Rafael Souza",
      phoneNumber: "(27) 91122-3344",
      status: "Enviado",
      dateNumber: "2024-03-10 13:40",
      service: "Recovery",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "success";
      case "Respondido":
        return "info";
      case "Não Lido":
        return "warning";
      case "Cancelado":
        return "error";
      default:
        return "light";
    }
  };

  // Paginação
  const paginatedData = useMemo(() => {
    return tableData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(tableData.length / itemsPerPage);
  }, [tableData.length, itemsPerPage]);

  const handleOpenModal = () => {
    openViewModal();
  };

  const handleCloseModal = () => {
    closeViewModal();
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="table-auto">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Nome
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Telefone
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Data/Hora
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Serviço
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((item: WhatsappMessage) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.dateNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.service}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleOpenModal()}
                        rel="noopener"
                        className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:hover:bg-white/[0.03] dark:hover:text-blue-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6.663 3.116 1.805 4.172m-7.155 0A8.25 8.25 0 1 1 15.75 8.25M9.75 17.1m6.802-4.991a.75.75 0 0 0-1.225-.981m-.78.185a.75.75 0 0 0-1.06-1.061M12 18.75a6 6 0 0 1-6-6m6 6a6 6 0 0 0 6-6m-6 6v3.75m0-3.75h3.75" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {}}
                        rel="noopener"
                        className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-green-300 bg-white text-sm font-medium text-green-700 shadow-theme-xs hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:bg-green-800 dark:text-green-400 dark:hover:bg-white/[0.03] dark:hover:text-green-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              Mensagens
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mensagens trocadas entre o Bot
            </p>
          </div>
          <Message group={group} />
        </div>
      </Modal>
    </>
  );
}
