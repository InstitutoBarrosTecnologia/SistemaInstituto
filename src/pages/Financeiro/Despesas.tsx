import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { DollarLineIcon, ChevronUpIcon } from "../../icons";
import { useModal } from "../../hooks/useModal";
import { useFinancialStats } from "../../hooks/useFinancialStats";
import { FinancialTransactionUtils, TransactionFilters } from "../../services/financialTransactions";
import { BranchOfficeService } from "../../services/service/BranchOfficeService";
import ModalNovaDespesa from "./components/ModalNovaDespesa";
import DespesasGrid from "../../components/tables/DespesasGrid/DespesasGrid";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Despesas() {
  const {
    isOpen: isModalOpen,
    openModal: openModal,
    closeModal: closeModal,
  } = useModal();

  const {
    isOpen: showFilters,
    openModal: openFilters,
    closeModal: closeFilters,
  } = useModal();

  // Estados dos filtros
  const [filterInputs, setFilterInputs] = useState({
    unidadeId: "",
    dataInicio: "",
    dataFim: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<TransactionFilters | undefined>(undefined);

  // Buscar unidades para o select
  const { data: unidades = [] } = useQuery({
    queryKey: ["allBranchOffice"],
    queryFn: BranchOfficeService.getAll,
  });

  const unidadeOptions = unidades.map((unidade) => ({
    label: unidade.nomeFilial || "Sem nome",
    value: unidade.id || "",
  }));

  // Função para aplicar filtros
  const handleApplyFilters = () => {
    const filters: TransactionFilters = {};
    
    if (filterInputs.unidadeId) {
      filters.unidadeId = filterInputs.unidadeId;
    }
    if (filterInputs.dataInicio) {
      filters.dataInicio = filterInputs.dataInicio;
    }
    if (filterInputs.dataFim) {
      filters.dataFim = filterInputs.dataFim;
    }

    setAppliedFilters(Object.keys(filters).length > 0 ? filters : undefined);
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilterInputs({
      unidadeId: "",
      dataInicio: "",
      dataFim: "",
    });
    setAppliedFilters(undefined);
  };

  // Buscar estatísticas financeiras da API
  const { 
    receitasMes, 
    despesasMes, 
    saldoLiquido, 
    pendentes,
    totalTransacoes,
    isLoading: isLoadingStats 
  } = useFinancialStats();

  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return (
    <>
      <PageMeta
        title="Lançamentos Financeiros - Financeiro"
        description="Gerencie todas as transações financeiras do instituto"
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Lançamentos Financeiros" />

        {/* Header Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
                <DollarLineIcon className="text-blue-600 size-6 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Gestão Financeira
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Controle todas as saídas e recebimentos do instituto
                </p>
                {!isLoadingStats && (
                  <p className="text-sm text-gray-400 mt-1">
                    {totalTransacoes} transação(ões) • {currentMonthName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Novo Lançamento
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Recebimento esperado
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {isLoadingStats ? (
                  <span className="animate-pulse bg-gray-300 h-8 w-32 rounded block"></span>
                ) : (
                  FinancialTransactionUtils.formatCurrency(receitasMes)
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">Transações esperados em {currentMonthName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Despesas
              </h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {isLoadingStats ? (
                  <span className="animate-pulse bg-gray-300 h-8 w-32 rounded block"></span>
                ) : (
                  FinancialTransactionUtils.formatCurrency(despesasMes)
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">Gastos aprovados em {currentMonthName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Saldo Líquido
              </h3>
              <p className={`text-2xl font-bold mt-1 ${saldoLiquido >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {isLoadingStats ? (
                  <span className="animate-pulse bg-gray-300 h-8 w-32 rounded block"></span>
                ) : (
                  FinancialTransactionUtils.formatCurrency(saldoLiquido)
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {saldoLiquido >= 0 ? 'Lucro' : 'Déficit'} esperado do mês
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Transações Pendentes
              </h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                {isLoadingStats ? (
                  <span className="animate-pulse bg-gray-300 h-8 w-32 rounded block"></span>
                ) : (
                  FinancialTransactionUtils.formatCurrency(pendentes)
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">Aguardando aprovação</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="mb-6">
              <button
                onClick={showFilters ? closeFilters : openFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <span>Filtros</span>
                <ChevronUpIcon 
                  className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="unidade">Unidade</Label>
                      <Select
                        options={unidadeOptions}
                        value={filterInputs.unidadeId}
                        placeholder="Selecione uma unidade"
                        onChange={(value) =>
                          setFilterInputs((prev) => ({ ...prev, unidadeId: value }))
                        }
                        className="dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataInicio">Data Cad. Início</Label>
                      <Input
                        type="date"
                        id="dataInicio"
                        value={filterInputs.dataInicio}
                        onChange={(e) =>
                          setFilterInputs((prev) => ({ ...prev, dataInicio: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataFim">Data Cad. Fim</Label>
                      <Input
                        type="date"
                        id="dataFim"
                        value={filterInputs.dataFim}
                        onChange={(e) =>
                          setFilterInputs((prev) => ({ ...prev, dataFim: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={handleApplyFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Aplicar Filtros
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="px-4 py-2 text-sm"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Grid de Transações Financeiras */}
            <DespesasGrid filters={appliedFilters} />
          </div>
        </div>
      </div>

      {/* Modal Novo Lançamento Financeiro */}
      <ModalNovaDespesa isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
