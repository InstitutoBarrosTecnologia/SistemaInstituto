import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";
import { useModal } from "../../../hooks/useModal";
import { DespesaService } from "../../../services/service/DespesaService";
import { DespesaResponseDto, EDespesaStatus, getDespesaStatusLabel, getDespesaStatusColor } from "../../../services/model/Dto/Response/DespesaResponseDto";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../../icons";

export default function DespesasGrid() {
  const [selectedDespesa, setSelectedDespesa] = useState<DespesaResponseDto | undefined>();
  const [idDeleteRegister, setIdDeleteRegister] = useState<string>("");
  const [statusToUpdate, setStatusToUpdate] = useState<EDespesaStatus>(EDespesaStatus.Analise);
  
  const queryClient = useQueryClient();

  // Modais
  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const { isOpen: isOpenStatus, openModal: openModalStatus, closeModal: closeModalStatus } = useModal();
  const { isOpen: isOpenView, openModal: openModalView, closeModal: closeModalView } = useModal();

  // Query para buscar todas as despesas
  const { data: despesas, isLoading, isError } = useQuery({
    queryKey: ["allDespesas"],
    queryFn: DespesaService.getAll,
  });

  // Mutation para deletar despesa
  const mutationDelete = useMutation({
    mutationFn: DespesaService.delete,
    onSuccess: () => {
      toast.success("Despesa excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["allDespesas"] });
      closeModalDelete();
      setIdDeleteRegister("");
    },
    onError: () => {
      toast.error("Erro ao excluir despesa!");
    },
  });

  // Mutation para atualizar status
  const mutationUpdateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EDespesaStatus }) =>
      DespesaService.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["allDespesas"] });
      closeModalStatus();
      setSelectedDespesa(undefined);
    },
    onError: () => {
      toast.error("Erro ao atualizar status!");
    },
  });

  const handleDelete = (despesa: DespesaResponseDto) => {
    setIdDeleteRegister(despesa.id || "");
    openModalDelete();
  };

  const handleUpdateStatus = (despesa: DespesaResponseDto) => {
    setSelectedDespesa(despesa);
    setStatusToUpdate(despesa.status);
    openModalStatus();
  };

  const handleView = (despesa: DespesaResponseDto) => {
    setSelectedDespesa(despesa);
    openModalView();
  };

  const handlePostDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idDeleteRegister) {
      mutationDelete.mutate(idDeleteRegister);
    }
  };

  const handlePostUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDespesa?.id) {
      mutationUpdateStatus.mutate({
        id: selectedDespesa.id,
        status: statusToUpdate,
      });
    }
  };

  const statusOptions = [
    { value: EDespesaStatus.Analise.toString(), label: "Análise" },
    { value: EDespesaStatus.Aprovado.toString(), label: "Aprovado" },
    { value: EDespesaStatus.Recusado.toString(), label: "Recusado" },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: EDespesaStatus) => {
    const colorClasses = getDespesaStatusColor(status);
    const label = getDespesaStatusLabel(status);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">Erro ao carregar despesas!</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="text-left">
                Nome da Despesa
              </TableCell>
              <TableCell isHeader className="text-left">
                Unidade
              </TableCell>
              <TableCell isHeader className="text-center">
                Quantidade
              </TableCell>
              <TableCell isHeader className="text-center">
                Status
              </TableCell>
              <TableCell isHeader className="text-center">
                Data Cadastro
              </TableCell>
              <TableCell isHeader className="text-center">
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {despesas && despesas.length > 0 ? (
              despesas.map((despesa) => (
                <TableRow key={despesa.id}>
                  <TableCell className="font-medium text-gray-800 dark:text-white/90">
                    <div>
                      <p className="font-semibold">{despesa.nomeDespesa}</p>
                      {despesa.descricao && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {despesa.descricao}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {despesa.nomeUnidade || "N/A"}
                  </TableCell>
                  <TableCell className="text-center text-gray-500 dark:text-gray-400">
                    {despesa.quantidade}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(despesa.status)}
                  </TableCell>
                  <TableCell className="text-center text-gray-500 dark:text-gray-400">
                    {formatDate(despesa.dataCadastro)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(despesa)}
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        title="Visualizar"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(despesa)}
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-500 transition-colors rounded-lg hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                        title="Alterar Status"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(despesa)}
                        className="inline-flex items-center justify-center w-8 h-8 text-red-500 transition-colors rounded-lg hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                        title="Excluir"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhuma despesa cadastrada ainda.
                </TableCell>
                <TableCell className="px-5 py-8">-</TableCell>
                <TableCell className="px-5 py-8">-</TableCell>
                <TableCell className="px-5 py-8">-</TableCell>
                <TableCell className="px-5 py-8">-</TableCell>
                <TableCell className="px-5 py-8">-</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Visualização */}
      <Modal isOpen={isOpenView} onClose={closeModalView} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Detalhes da Despesa
            </h4>
          </div>
          
          {selectedDespesa && (
            <div className="px-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome:</label>
                <p className="text-gray-900 dark:text-white">{selectedDespesa.nomeDespesa}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</label>
                <p className="text-gray-900 dark:text-white">{selectedDespesa.descricao || "N/A"}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidade:</label>
                <p className="text-gray-900 dark:text-white">{selectedDespesa.nomeUnidade || "N/A"}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade:</label>
                <p className="text-gray-900 dark:text-white">{selectedDespesa.quantidade}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                <div className="mt-1">{getStatusBadge(selectedDespesa.status)}</div>
              </div>
              
              {selectedDespesa.arquivo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Arquivo:</label>
                  <p className="text-blue-600 dark:text-blue-400">{selectedDespesa.arquivo}</p>
                </div>
              )}
              
              {selectedDespesa.observacoes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações:</label>
                  <p className="text-gray-900 dark:text-white">{selectedDespesa.observacoes}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-end gap-3 px-2 mt-6">
            <Button size="sm" variant="outline" onClick={closeModalView}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Atualização de Status */}
      <Modal isOpen={isOpenStatus} onClose={closeModalStatus} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Alterar Status
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Altere o status da despesa: <strong>{selectedDespesa?.nomeDespesa}</strong>
            </p>
          </div>

          <form className="flex flex-col" onSubmit={handlePostUpdateStatus}>
            <div className="px-2 pb-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Novo Status:
                </label>
                <Select
                  options={statusOptions}
                  value={statusToUpdate.toString()}
                  onChange={(value) => setStatusToUpdate(parseInt(value) as EDespesaStatus)}
                  className="dark:bg-dark-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModalStatus}>
                Cancelar
              </Button>
              <button
                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                type="submit"
                disabled={mutationUpdateStatus.isPending}
              >
                {mutationUpdateStatus.isPending ? "Atualizando..." : "Atualizar"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isOpenDelete} onClose={closeModalDelete} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
              Excluir Despesa
            </h4>
          </div>
          
          <form className="flex flex-col" onSubmit={handlePostDelete}>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 text-center dark:text-white/90 lg:mb-6">
                  Tem certeza que deseja excluir esta despesa permanentemente?
                </h5>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModalDelete}>
                Cancelar
              </Button>
              <button
                className="bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                type="submit"
                disabled={mutationDelete.isPending}
              >
                {mutationDelete.isPending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Toaster position="bottom-right" />
    </>
  );
}
