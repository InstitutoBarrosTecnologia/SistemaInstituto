import {
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

export default function WhatsappTableLeadComponent() {

  const { isOpen, openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal();
  };

  interface WhatsappMessage {
    id: string;
    name: string
    phoneNumber: string;
    status: string;
    dateNumber: string;
    service: string;
    actions?: string;
  }

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
      service: "Liberação Miofacial"
    },
    {
      id: "2",
      name: "Fernanda Lopes",
      phoneNumber: "(21) 99876-5432",
      status: "Não Lido",
      dateNumber: "2024-03-15 14:20",
      service: "Recovery"
    },
    {
      id: "3",
      name: "João Mendes",
      phoneNumber: "(31) 93456-7890",
      status: "Respondido",
      dateNumber: "2024-03-14 09:15",
      service: "Lesão"
    },
    {
      id: "4",
      name: "Luciana Prado",
      phoneNumber: "(51) 98765-4321",
      status: "Cancelado",
      dateNumber: "2024-03-13 11:45",
      service: "Não Identificado"
    },
    {
      id: "5",
      name: "Marcelo Araújo",
      phoneNumber: "(41) 92345-6789",
      status: "Cancelado",
      dateNumber: "2024-03-12 16:00",
      service: "Não Identificado"
    },
    {
      id: "6",
      name: "Patrícia Ferreira",
      phoneNumber: "(61) 99988-7766",
      status: "Respondido",
      dateNumber: "2024-03-11 17:50",
      service: "Reclamação"
    },
    {
      id: "7",
      name: "Rafael Souza",
      phoneNumber: "(27) 91122-3344",
      status: "Enviado",
      dateNumber: "2024-03-10 13:40",
      service: "Recovery"
    },
  ];


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
              {tableData.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{lead.name}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {lead.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        lead.status === "Novo"
                          ? "success"
                          : lead.status === "Respondido"
                            ? "info"
                            : lead.status === "Não Lido"
                              ? "warning"
                              : lead.status === "Cancelado"
                                ? "error"
                                : "light"
                      }
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {lead.dateNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {lead.service}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex gap-2">
                      <button
                        className="h-9 w-9 rounded-full bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800"
                        onClick={() => handleOpenModal()}
                      >
                        {/* Icone WhatsApp ou similar */}
                        <svg className="mx-auto size-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                        </svg>
                      </button>
                      <button className="h-9 p-2 w-9 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800">
                        {/* Icone Email */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Menssagens
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Menssagens trocadas entre o Bot
            </p>
          </div>
          <div>

          </div>
          <Message
            group={group}
          />
        </div>
      </Modal>
    </>
  );
}
