import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { DollarLineIcon, PlusIcon } from "../../icons";
import { useModal } from "../../hooks/useModal";
import ModalNovaDespesa from "./components/ModalNovaDespesa";
import DespesasGrid from "../../components/tables/DespesasGrid/DespesasGrid";

export default function Despesas() {
  const {
    isOpen: isModalOpen,
    openModal: openModal,
    closeModal: closeModal,
  } = useModal();
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
                  Controle todas as despesas e recebimentos do instituto
                </p>
              </div>
            </div>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <PlusIcon className="size-4" />
              Novo Lançamento
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Receitas do Mês
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                R$ 28.750,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Despesas do Mês
              </h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                R$ 12.450,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Saldo Líquido
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                R$ 16.300,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pendentes
              </h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                R$ 3.890,00
              </p>
            </div>
          </div>

          {/* Grid de Transações Financeiras */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <DespesasGrid />
          </div>
        </div>
      </div>

      {/* Modal Novo Lançamento Financeiro */}
      <ModalNovaDespesa isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
