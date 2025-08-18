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

import {
  EDespesaStatus,
  getDespesaStatusLabel,
  FinancialTransactionUtils,
} from "../../../services/financialTransactions";
import { useFinancialTransactions } from "../../../hooks/useFinancialTransactions";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";

export default function DespesasGrid() {
  const [selectedDespesa, setSelectedDespesa] = useState<any>(undefined);
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isOpenDelete,
    openModal: openModalDelete,
    closeModal: closeModalDelete,
  } = useModal();
  const {
    isOpen: isOpenStatus,
    openModal: openModalStatus,
    closeModal: closeModalStatus,
  } = useModal();
  const [idDeleteRegister, setIdDeleteRegister] = useState<string>("");
  const [statusToUpdate, setStatusToUpdate] = useState<EDespesaStatus>(
    EDespesaStatus.Pendente
  );

  // Usar o hook da nova API
  const {
    transactions,
    isLoading,
    isError,
    updateTransactionStatus,
    deleteTransaction,
    isUpdatingStatus,
    isDeleting,
  } = useFinancialTransactions();

  const handleOpenModal = (despesa: any) => {
    setSelectedDespesa(despesa);
    openModal();
  };

  const handleOpenModalDelete = (id: string) => {
    setIdDeleteRegister(id);
    openModalDelete();
  };

  const handleOpenModalStatus = (despesa: any) => {
    setSelectedDespesa(despesa);
    setStatusToUpdate(despesa.status);
    openModalStatus();
  };

  const handleDeleteRegister = () => {
    if (idDeleteRegister) {
      deleteTransaction(idDeleteRegister);
      closeModalDelete();
    }
  };

  const handlePostUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDespesa?.id) {
      updateTransactionStatus({
        id: selectedDespesa.id,
        data: { status: statusToUpdate },
      });
      closeModalStatus();
      setSelectedDespesa(undefined);
    }
  };

  const statusOptions = [
    { value: EDespesaStatus.Pendente.toString(), label: "Pendente" },
    { value: EDespesaStatus.Aprovada.toString(), label: "Aprovada" },
    { value: EDespesaStatus.Cancelada.toString(), label: "Cancelada" },
    { value: EDespesaStatus.Concluida.toString(), label: "Concluída" },
  ];

  if (isLoading)
    return (
      <p className="text-dark dark:text-white">Carregando transações...</p>
    );
  if (isError)
    return (
      <p className="text-dark dark:text-white">Erro ao carregar transações!</p>
    );

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
                  Tipo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Transação
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Valor (R$)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Fisioterapeuta/Cliente
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Forma Pagamento
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
                  Data
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
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge
                        size="sm"
                        color={
                          FinancialTransactionUtils.convertTipoTransacaoToString(
                            transaction.tipo
                          ) === "recebimento"
                            ? "success"
                            : "error"
                        }
                      >
                        {FinancialTransactionUtils.convertTipoTransacaoToString(
                          transaction.tipo
                        ) === "recebimento"
                          ? "Recebimento"
                          : "Despesa"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer hover:text-blue-600"
                      onClick={() => handleOpenModal(transaction)}
                    >
                      <div>
                        <div className="font-medium">
                          {transaction.nomeDespesa}
                        </div>
                        <div className="text-xs text-gray-400">
                          {transaction.nomeUnidade || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <span
                        className={`font-semibold ${
                          FinancialTransactionUtils.convertTipoTransacaoToString(
                            transaction.tipo
                          ) === "recebimento"
                            ? "text-green-600 dark:text-green-400 mt-1"
                            : "text-red-600 dark:text-red-400 mt-1"
                        }`}
                      >
                        {FinancialTransactionUtils.formatCurrency(
                          transaction.valores
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>
                        {transaction.funcionario && (
                          <div className="text-blue-600">
                            {transaction.funcionario.nome}
                          </div>
                        )}
                        {transaction.cliente && (
                          <div className="text-gray-600">
                            {transaction.cliente.nome}
                          </div>
                        )}
                        {!transaction.funcionario &&
                          !transaction.cliente && (
                            <span className="text-gray-400">N/A</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>
                        <div>{transaction.formaPagamento || "N/A"}</div>
                        <div className="text-xs text-gray-400">
                          {transaction.conta}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge
                        size="sm"
                        color={
                          transaction.status === EDespesaStatus.Aprovada
                            ? "success"
                            : transaction.status === EDespesaStatus.Cancelada
                            ? "error"
                            : "warning"
                        }
                      >
                        {getDespesaStatusLabel(transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {transaction.dataCadastro
                        ? FinancialTransactionUtils.formatDateForDisplay(
                            transaction.dataCadastro
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModalStatus(transaction)}
                          disabled={isUpdatingStatus}
                        >
                          Status
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModalDelete(transaction.id!)}
                          disabled={isDeleting}
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    -
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {selectedDespesa && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">
              Detalhes da Transação
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo:
                </label>
                <Badge
                  size="sm"
                  color={
                    FinancialTransactionUtils.convertTipoTransacaoToString(
                      selectedDespesa.tipo
                    ) === "recebimento"
                      ? "success"
                      : "error"
                  }
                >
                  {FinancialTransactionUtils.convertTipoTransacaoToString(
                    selectedDespesa.tipo
                  ) === "recebimento"
                    ? "Recebimento"
                    : "Despesa"}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor:
                </label>
                <p
                  className={`font-semibold ${
                    FinancialTransactionUtils.convertTipoTransacaoToString(
                      selectedDespesa.tipo
                    ) === "recebimento"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {FinancialTransactionUtils.formatCurrency(
                    selectedDespesa.valores
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status:
                </label>
                <Badge
                  size="sm"
                  color={
                    selectedDespesa.status === EDespesaStatus.Aprovada
                      ? "success"
                      : selectedDespesa.status === EDespesaStatus.Cancelada
                      ? "error"
                      : "warning"
                  }
                >
                  {getDespesaStatusLabel(selectedDespesa.status)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Transação:
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedDespesa.nomeDespesa}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unidade:
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedDespesa.nomeFilial || "N/A"}
                </p>
              </div>
            </div>

            {(selectedDespesa.fisioterapeuta || selectedDespesa.cliente) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDespesa.fisioterapeuta && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fisioterapeuta:
                    </label>
                    <p className="text-blue-600 dark:text-blue-400">
                      {selectedDespesa.fisioterapeuta}
                    </p>
                  </div>
                )}

                {selectedDespesa.cliente && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cliente:
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedDespesa.cliente}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Forma de Pagamento:
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedDespesa.formaPagamento || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conta:
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedDespesa.conta || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo Documento:
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedDespesa.tipoDocumento || "N/A"}
                </p>
              </div>
            </div>

            {selectedDespesa.descricao && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição:
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-900 dark:text-white">
                    {selectedDespesa.descricao}
                  </p>
                </div>
              </div>
            )}

            {selectedDespesa.arquivo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Arquivo:
                </label>
                <p className="text-blue-600 dark:text-blue-400 break-all">
                  📎 {selectedDespesa.arquivo}
                </p>
              </div>
            )}

            {selectedDespesa.observacoes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observações:
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-900 dark:text-white">
                    {selectedDespesa.observacoes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de Atualização de Status */}
      <Modal
        isOpen={isOpenStatus}
        onClose={closeModalStatus}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <form onSubmit={handlePostUpdateStatus}>
            <h3 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Atualizar Status
            </h3>
            <div className="space-y-4">
              <Select
                value={statusToUpdate.toString()}
                onChange={(value) =>
                  setStatusToUpdate(Number(value) as EDespesaStatus)
                }
                options={statusOptions}
              />
              <div className="flex gap-2">
                <Button disabled={isUpdatingStatus} className="flex-1">
                  {isUpdatingStatus ? "Atualizando..." : "Atualizar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={closeModalStatus}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isOpenDelete}
        onClose={closeModalDelete}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="space-y-4">
            <h3 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Confirmar Exclusão
            </h3>
            <p className="mb-2 font-semibold text-gray-800 dark:text-white/90">
              Tem certeza que deseja excluir esta transação? Esta ação não pode
              ser desfeita.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleDeleteRegister}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
              <Button
                variant="outline"
                onClick={closeModalDelete}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
