import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import MultiSelect from "../../components/form/MultiSelect";
import { Option } from "../../components/form/MultiSelect";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { PaperPlaneIcon, PencilIcon } from "../../icons";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationRequestDto } from "../../services/model/Dto/Request/NotificationRequestDto";
import EmployeeService from "../../services/service/EmployeeService";

export default function Notifications() {
  const [formData, setFormData] = useState({
    titulo: "",
    mensagem: "",
    destinatarios: "todos",
    ativo: true,
    dataExpiracao: "",
  });

  const [selectedFuncionarios, setSelectedFuncionarios] = useState<Option[]>(
    []
  );
  const [funcionariosOptions, setFuncionariosOptions] = useState<Option[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage] = useState(1);
  const pageSize = 10;

  // Query para buscar funcionários
  const { data: funcionarios } = useQuery({
    queryKey: ["allEmployee"],
    queryFn: EmployeeService.getAll,
  });

  // Hook para gerenciar notificações com API
  const {
    notifications,
    loading,
    error,
    pagination,
    createNotification,
    updateNotification,
    deleteNotification,
    toggleStatus,
    sendNotification,
  } = useNotifications({
    page: currentPage,
    pageSize,
    admin: true,
  });

  // Mapear funcionários para options do MultiSelect
  useEffect(() => {
    if (funcionarios && Array.isArray(funcionarios)) {
      const mappedFuncionarios = funcionarios.map((funcionario: any) => ({
        value: funcionario.id,
        text: funcionario.nome,
        preco: "", // Campo obrigatório no MultiSelect mas não usado aqui
      }));

      // Adicionar a opção "Todos" no início da lista
      const optionsWithTodos = [
        {
          value: "todos",
          text: "Todos os funcionários",
          preco: "",
        },
        ...mappedFuncionarios,
      ];

      setFuncionariosOptions(optionsWithTodos);
    }
  }, [funcionarios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação da data de expiração
    if (formData.dataExpiracao) {
      const dataExpiracao = new Date(formData.dataExpiracao);
      const agora = new Date();

      if (dataExpiracao <= agora) {
        toast.error("Data de expiração deve ser maior que a data atual");
        return;
      }
    }

    const notificationData: NotificationRequestDto = {
      titulo: formData.titulo,
      mensagem: formData.mensagem,
      destinatarios: formData.destinatarios,
      ativo: formData.ativo,
      dataExpiracao: formData.dataExpiracao || undefined,
    };

    try {
      let success = false;

      if (editingId) {
        // Atualizar notificação existente
        success = await updateNotification(editingId, notificationData);
        if (success) {
          toast.success("Notificação atualizada com sucesso! 🎉");
          setEditingId(null);
        }
      } else {
        // Criar nova notificação
        success = await createNotification(notificationData);
        if (success) {
          toast.success("Notificação criada com sucesso! 🎉");
        }
      }

      if (success) {
        handleClear();
      }
    } catch (error: any) {
      // Tratar erros da API
      let errorMessage = "Erro desconhecido";

      if (error?.response?.data) {
        const errorData = error.response.data;

        // Se for um array de erros da API
        if (
          Array.isArray(errorData) &&
          errorData.length > 0 &&
          errorData[0].errorMensagem
        ) {
          errorMessage = errorData[0].errorMensagem;
        }
        // Se for um objeto com message
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Se for string direta
        else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(`Erro: ${errorMessage}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFuncionariosChange = (selectedOptions: Option[]) => {
    setSelectedFuncionarios(selectedOptions);
    // Converter array de funcionários selecionados para string de IDs separados por vírgula
    const funcionarioIds = selectedOptions
      .map((option) => option.value)
      .join(",");
    setFormData((prev) => ({
      ...prev,
      destinatarios: funcionarioIds,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      ativo: checked,
    }));
  };

  const handleTextAreaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mensagem: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      titulo: "",
      mensagem: "",
      destinatarios: "",
      ativo: true,
      dataExpiracao: "",
    });
    setSelectedFuncionarios([]);
    setEditingId(null);
  };

  const handleEdit = (notification: any) => {
    setFormData({
      titulo: notification.titulo,
      mensagem: notification.mensagem,
      destinatarios: notification.destinatarios,
      ativo: notification.ativo,
      dataExpiracao: notification.dataExpiracao
        ? new Date(notification.dataExpiracao).toISOString().slice(0, 16)
        : "",
    });

    // Restaurar funcionários selecionados baseado nos IDs
    if (notification.destinatarios && funcionariosOptions.length > 0) {
      const ids = notification.destinatarios
        .split(",")
        .filter((id: string) => id.trim() !== "");
      const selectedOptions = ids.map((id: string) => {
        const funcionario = funcionariosOptions.find(
          (opt) => opt.value === id.trim()
        );
        return (
          funcionario || {
            value: id.trim(),
            text: `ID: ${id.trim()}`,
            preco: "",
          }
        );
      });
      setSelectedFuncionarios(selectedOptions);
    } else {
      setSelectedFuncionarios([]);
    }

    setEditingId(notification.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta notificação?")) {
      try {
        const success = await deleteNotification(id);
        if (success) {
          toast.success("Notificação excluída com sucesso! 🗑️");
        }
      } catch (error: any) {
        let errorMessage = "Erro ao excluir notificação";

        if (error?.response?.data) {
          const errorData = error.response.data;

          if (
            Array.isArray(errorData) &&
            errorData.length > 0 &&
            errorData[0].errorMensagem
          ) {
            errorMessage = errorData[0].errorMensagem;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(`Erro: ${errorMessage}`);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const success = await toggleStatus(id, !currentStatus);
      if (success) {
        const statusText = !currentStatus ? "ativada" : "desativada";
        toast.success(`Notificação ${statusText} com sucesso! 🔄`);
      }
    } catch (error: any) {
      let errorMessage = "Erro ao alterar status da notificação";

      if (error?.response?.data) {
        const errorData = error.response.data;

        if (
          Array.isArray(errorData) &&
          errorData.length > 0 &&
          errorData[0].errorMensagem
        ) {
          errorMessage = errorData[0].errorMensagem;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(`Erro: ${errorMessage}`);
    }
  };

  const handleSend = async (id: string) => {
    if (window.confirm("Tem certeza que deseja enviar esta notificação?")) {
      try {
        const result = await sendNotification(id);
        if (result) {
          toast.success(
            `Notificação enviada para ${result.destinatariosEnviados} destinatário(s)! 📨`,
            { duration: 4000 }
          );
        }
      } catch (error: any) {
        let errorMessage = "Erro ao enviar notificação";

        if (error?.response?.data) {
          const errorData = error.response.data;

          if (
            Array.isArray(errorData) &&
            errorData.length > 0 &&
            errorData[0].errorMensagem
          ) {
            errorMessage = errorData[0].errorMensagem;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(`Erro: ${errorMessage}`);
      }
    }
  };

  const destinatariosOptions = [
    { value: "todos", label: "Todos os usuários" },
    { value: "administradores", label: "Apenas Administradores" },
    { value: "funcionarios", label: "Funcionários" },
    { value: "fisioterapeutas", label: "Fisioterapeutas" },
    { value: "comercial", label: "Comercial" },
  ];

  const getDestinatarioLabel = (value: string) => {
    // Se for "todos", retornar diretamente
    if (value === "todos") {
      return "Todos os funcionários";
    }

    // Se for um valor das opções antigas, retornar o label correspondente
    const oldOption = destinatariosOptions.find((opt) => opt.value === value);
    if (oldOption) {
      return oldOption.label;
    }

    // Se for IDs de funcionários separados por vírgula, buscar os nomes
    if (value.includes(",") || funcionariosOptions.length > 0) {
      const ids = value.split(",").filter((id) => id.trim() !== "");
      const nomes = ids.map((id) => {
        const funcionario = funcionariosOptions.find(
          (opt) => opt.value === id.trim()
        );
        return funcionario ? funcionario.text : `ID: ${id}`;
      });
      return nomes.join(", ");
    }

    // Se for um único ID, buscar o nome
    const funcionario = funcionariosOptions.find((opt) => opt.value === value);
    return funcionario ? funcionario.text : value;
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

  return (
    <>
      <PageMeta
        title="Enviar Notificação"
        description="Envie notificações para usuários do sistema"
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Enviar Notificação" />

        {/* Header Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
              <PaperPlaneIcon className="text-blue-600 size-6 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Enviar Notificação
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Envie notificações para usuários do sistema
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>
                Título da Notificação <span className="text-red-300">*</span>
              </Label>
              <Input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Digite o título da notificação"
                required
              />
            </div>

            <div>
              <MultiSelect
                label="Destinatários *"
                options={funcionariosOptions}
                defaultSelected={selectedFuncionarios.map((f) => f.value)}
                onChangeFull={handleFuncionariosChange}
                disabled={false}
              />
            </div>

            <div>
              <Label>
                Mensagem <span className="text-red-300">*</span>
              </Label>
              <TextArea
                value={formData.mensagem}
                onChange={handleTextAreaChange}
                placeholder="Digite a mensagem da notificação"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Status da Notificação</Label>
                <div className="mt-2">
                  <Checkbox
                    label="Notificação ativa"
                    checked={formData.ativo}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>

              <div>
                <Label>Data de Expiração</Label>
                <Input
                  type="datetime-local"
                  name="dataExpiracao"
                  value={formData.dataExpiracao}
                  onChange={handleInputChange}
                  placeholder="Selecione a data de expiração"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-lg transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                }`}
              >
                <PaperPlaneIcon className="size-4" />
                {loading
                  ? "Processando..."
                  : editingId
                  ? "Atualizar Notificação"
                  : "Enviar Notificação"}
              </button>

              <Button
                variant="outline"
                onClick={handleClear}
                disabled={loading}
              >
                Limpar
              </Button>
            </div>
          </form>
        </div>

        {/* Tabela de Notificações */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Notificações Cadastradas
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Lista de todas as notificações criadas no sistema
              {pagination.totalCount > 0 && ` (${pagination.totalCount} total)`}
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Carregando notificações...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Erro: {error}</p>
            </div>
          )}

          {!loading && !error && (
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
                        Destinatários
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
                      <TableCell
                        isHeader
                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Data de Expiração
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
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {getDestinatarioLabel(
                                  notification.destinatarios
                                )}
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
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {notification.dataExpiracao
                                ? formatDate(notification.dataExpiracao)
                                : "Sem expiração"}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(notification)}
                                  className="p-2 flex h-9 w-9 items-center justify-center rounded-full border border-yellow-300 bg-white text-sm font-medium text-yellow-700 shadow-theme-xs hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-700 dark:bg-yellow-800 dark:text-yellow-400 dark:hover:bg-white/[0.03] dark:hover:text-yellow-200"
                                  title="Editar notificação"
                                >
                                  <PencilIcon className="size-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      notification.id,
                                      notification.ativo
                                    )
                                  }
                                  className={`p-2 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium shadow-theme-xs ${
                                    notification.ativo
                                      ? "border-orange-300 bg-white text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-700 dark:bg-orange-800 dark:text-orange-400"
                                      : "border-green-300 bg-white text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:bg-green-800 dark:text-green-400"
                                  }`}
                                  title={
                                    notification.ativo ? "Desativar" : "Ativar"
                                  }
                                >
                                  {notification.ativo ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-4"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-4"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m4.5 12.75 6 6 9-13.5"
                                      />
                                    </svg>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleSend(notification.id)}
                                  disabled={!notification.ativo}
                                  className="p-2 flex h-9 w-9 items-center justify-center rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:hover:bg-white/[0.03] dark:hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Enviar notificação"
                                >
                                  <PaperPlaneIcon className="size-4" />
                                </button>

                                <button
                                  onClick={() => handleDelete(notification.id)}
                                  className="p-2 flex h-9 w-9 items-center justify-center rounded-full border border-red-300 bg-white text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-red-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-200"
                                  title="Excluir notificação"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
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
                        Nenhuma notificação encontrada.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <Toaster position="bottom-right" />
    </>
  );
}
