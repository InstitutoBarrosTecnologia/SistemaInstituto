import { FC } from "react";
import { NotificationResponseDto } from "../../../services/model/Dto/Response/NotificationResponseDto";
import Badge from "../../../components/ui/badge/Badge";

interface NotificationDetailModalProps {
  notification: NotificationResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDetailModal: FC<NotificationDetailModalProps> = ({
  notification,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !notification) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Detalhes da Notificação
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-500 dark:text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Título
              </label>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {notification.titulo}
              </p>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Mensagem
              </label>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {notification.mensagem}
              </p>
            </div>

            {/* Grid de Informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Status
                </label>
                <Badge
                  size="sm"
                  color={notification.ativo ? "success" : "error"}
                >
                  {notification.ativo ? "Ativa" : "Inativa"}
                </Badge>
              </div>

              {/* Data de Criação */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Data de Criação
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {formatDate(notification.dataCriacao)}
                </p>
              </div>

              {/* Data de Expiração */}
              {notification.dataExpiracao && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Data de Expiração
                  </label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatDate(notification.dataExpiracao)}
                  </p>
                </div>
              )}

              {/* Data de Envio */}
              {notification.dataEnvio && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Data de Envio
                  </label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatDate(notification.dataEnvio)}
                  </p>
                </div>
              )}

              {/* Usuário Cadastro */}
              {notification.usrDescricaoCadastro && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Criado por
                  </label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {notification.usrDescricaoCadastro}
                  </p>
                </div>
              )}

              {/* Data de Atualização */}
              {notification.dataAtualizacao && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Última Atualização
                  </label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatDate(notification.dataAtualizacao)}
                  </p>
                </div>
              )}
            </div>

            {/* Destinatários */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Destinatários
              </label>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {notification.destinatarios === "todos"
                  ? "Todos os funcionários"
                  : notification.destinatarios}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationDetailModal;
