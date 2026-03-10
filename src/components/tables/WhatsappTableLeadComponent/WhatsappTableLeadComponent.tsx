import { DataGridBase, DataGridColumn, DataGridAction } from "../../DataGrid/DataGridBase";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal";
import Message from "../../whatsapp/message";
import { GroupMessage } from "../../../services/model/GroupMessage";
import { useModal } from "../../../stores/modalStore";

interface WhatsappMessage {
  id: string;
  name: string;
  phoneNumber: string;
  status: string;
  dateNumber: string;
  service: string;
}

export default function WhatsappTableLeadComponent() {
  const viewModal = useModal('viewLead');

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

  const columns: DataGridColumn<WhatsappMessage>[] = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "phoneNumber",
      label: "Telefone",
    },
    {
      key: "status",
      label: "Status",
      render: (_value, row) => (
        <Badge size="sm" color={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "dateNumber",
      label: "Data/Hora",
    },
    {
      key: "service",
      label: "Serviço",
    },
  ];

  const actions: DataGridAction<WhatsappMessage>[] = [
    {
      id: "message",
      label: "Mensagens",
      onClick: (item) => viewModal.open(item),
    },
    {
      id: "email",
      label: "Email",
      onClick: () => {},
    },
  ];

  return (
    <>
      <DataGridBase<WhatsappMessage>
        config={{
          columns,
          data: tableData,
          actions,
          itemsPerPage: 10,
          emptyMessage: "Nenhuma mensagem encontrada",
        }}
      />

      <Modal isOpen={viewModal.isOpen} onClose={viewModal.close} className="max-w-[700px] m-4">
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
