import { useState } from "react";
import { DataGridBase, DataGridColumn, DataGridAction } from "../../DataGrid/DataGridBase";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../stores/modalStore";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";
import ModalParcelasContent from "../../../pages/Financeiro/components/ModalParcelas";

import {
  EDespesaStatus,
  getDespesaStatusLabel,
  FinancialTransactionUtils,
} from "../../../services/financialTransactions";
import { EStatusParcela } from "../../../services/model/Enum/EStatusParcela";
import { useFinancialTransactions } from "../../../hooks/useFinancialTransactions";
import { TransactionFilters } from "../../../services/financialTransactions";
import { toast } from "react-hot-toast";

interface DespesasGridProps {
  filters?: TransactionFilters;
}

interface FinancialTransaction {
  id: string;
  tipo: any;
  nomeDespesa: string;
  descricao?: string;
  valores: number;
  funcionario?: { nome: string };
  cliente?: { nome: string };
  formaPagamento?: string;
  conta?: string;
  status: EDespesaStatus;
  dataCadastro?: string;
  parcelas: any[];
}

export default function DespesasGrid({ filters: _filters }: DespesasGridProps) {
  const [selectedDespesa, setSelectedDespesa] = useState<any>(undefined);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>("");
  const [statusToUpdate, setStatusToUpdate] = useState<EDespesaStatus>(
    EDespesaStatus.Pendente
  );

  const {
    isOpen: isOpenStatus,
    open: openStatus,
    close: closeStatus,
  } = useModal('editExpense');
  const {
    isOpen: isOpenParcelas,
    open: openParcelas,
    close: closeParcelas,
  } = useModal('viewExpense');

  const {
    transactions,
    isLoading,
    isError,
    updateTransactionStatus,
    deleteTransaction,
    isUpdatingStatus,
  } = useFinancialTransactions(_filters);

  const handleOpenModalStatus = (despesa: FinancialTransaction) => {
    setSelectedDespesa(despesa);
    setStatusToUpdate(despesa.status);
    openStatus(despesa);
  };

  const handleOpenModalParcelas = (id: string) => {
    setSelectedTransactionId(id);
    openParcelas(id);
  };

  const handlePostUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDespesa?.id) {
      // Validação especial para status "Concluída" + forma de pagamento "credito"
      if (
        statusToUpdate === EDespesaStatus.Concluida &&
        selectedDespesa.formaPagamento === "credito" &&
        selectedDespesa.parcelas &&
        selectedDespesa.parcelas.length > 0
      ) {
        // Verificar se todas as parcelas estão pagas
        const todasParcelasPagas = selectedDespesa.parcelas.every(
          (parcela: any) => parcela.status === EStatusParcela.Paga
        );

        if (!todasParcelasPagas) {
          toast.error(
            "Não é possível concluir uma transação de crédito com parcelas pendentes. Todas as parcelas devem estar pagas.",
            {
              duration: 5000,
            }
          );
          return;
        }
      }

      updateTransactionStatus({
        id: selectedDespesa.id,
        data: { status: statusToUpdate },
      });
      closeStatus();
      setSelectedDespesa(undefined);
    }
  };

  const statusOptions = [
    { value: EDespesaStatus.Pendente.toString(), label: "Pendente" },
    { value: EDespesaStatus.Aprovada.toString(), label: "Aprovada" },
    { value: EDespesaStatus.Cancelada.toString(), label: "Cancelada" },
    { value: EDespesaStatus.Concluida.toString(), label: "Concluída" },
  ];

  const columns: DataGridColumn<FinancialTransaction>[] = [
    {
      key: "tipo",
      label: "Tipo",
      render: (_value, row) => (
        <Badge
          size="sm"
          color={
            FinancialTransactionUtils.convertTipoTransacaoToString(row.tipo) ===
            "recebimento"
              ? "success"
              : "error"
          }
        >
          {FinancialTransactionUtils.convertTipoTransacaoToString(row.tipo) ===
          "recebimento"
            ? "Recebimento"
            : "Saída"}
        </Badge>
      ),
    },
    {
      key: "nomeDespesa",
      label: "Transação",
      render: (_value, row) => (
        <div>
          <div className="font-medium">{row.nomeDespesa}</div>
          <div className="text-xs text-gray-400 dark:text-white">
            {row.descricao || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "valores",
      label: "Valor (R$)",
      render: (_value, row) => (
        <span
          className={`font-semibold ${
            FinancialTransactionUtils.convertTipoTransacaoToString(row.tipo) ===
            "recebimento"
              ? "text-green-600 dark:text-green-400 mt-1"
              : "text-red-600 dark:text-red-400 mt-1"
          }`}
        >
          {FinancialTransactionUtils.formatCurrency(row.valores)}
        </span>
      ),
    },
    {
      key: "funcionario",
      label: "Fisioterapeuta/Cliente",
      render: (_value, row) => (
        <div>
          {row.funcionario && (
            <div className="text-blue-600 dark:text-blue-400">
              {row.funcionario.nome}
            </div>
          )}
          {row.cliente && (
            <div className="text-gray-600 dark:text-white">
              {row.cliente.nome}
            </div>
          )}
          {!row.funcionario && !row.cliente && (
            <span className="text-gray-400 dark:text-white">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "formaPagamento",
      label: "Forma Pagamento",
      render: (_value, row) => (
        <div>
          <div>{row.formaPagamento || "N/A"}</div>
          <div className="text-xs text-gray-400 dark:text-white">
            {row.conta}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_value, row) => (
        <Badge
          size="sm"
          color={
            row.status === EDespesaStatus.Aprovada
              ? "success"
              : row.status === EDespesaStatus.Concluida
              ? "success"
              : row.status === EDespesaStatus.Cancelada
              ? "error"
              : row.status === EDespesaStatus.Pendente
              ? "warning"
              : "error"
          }
        >
          {getDespesaStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      key: "dataCadastro",
      label: "Data",
      render: (_value, row) =>
        row.dataCadastro
          ? FinancialTransactionUtils.formatDateForDisplay(row.dataCadastro)
          : "N/A",
    },
  ];

  const actions: DataGridAction<FinancialTransaction>[] = [
    {
      id: "status",
      label: "Status",
      onClick: handleOpenModalStatus,
      condition: (item) =>
        item.status !== EDespesaStatus.Concluida &&
        item.status !== EDespesaStatus.Cancelada,
    },
    {
      id: "delete",
      label: "Excluir",
      variant: "danger",
      onClick: (item) => deleteTransaction(item.id),
      condition: (item) =>
        item.status !== EDespesaStatus.Concluida &&
        item.status !== EDespesaStatus.Cancelada,
    },
    {
      id: "parcelas",
      label: "Parcelas",
      onClick: (item) => handleOpenModalParcelas(item.id),
      condition: (item) =>
        item.parcelas.length > 0 &&
        item.status !== EDespesaStatus.Concluida &&
        item.status !== EDespesaStatus.Cancelada,
    },
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
      <DataGridBase<FinancialTransaction>
        config={{
          columns,
          data: (transactions as any[]) || [],
          actions,
          itemsPerPage: 10,
          loading: isLoading,
          error: isError ? "Erro ao carregar transações" : undefined,
          emptyMessage: "Nenhuma transação encontrada",
        }}
      />

      {/* Modal de Atualização de Status */}
      <Modal
        isOpen={isOpenStatus}
        onClose={closeStatus}
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
                  onClick={closeStatus}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Parcelas */}
      <Modal
        isOpen={isOpenParcelas}
        onClose={closeParcelas}
        className="max-w-[900px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <ModalParcelasContent transactionId={selectedTransactionId} />
        </div>
      </Modal>
    </>
  );
}
