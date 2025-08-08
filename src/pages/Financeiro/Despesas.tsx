import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { DollarLineIcon, PlusIcon } from "../../icons";
import { useModal } from "../../hooks/useModal";
import ModalNovaDespesa from "./components/ModalNovaDespesa";
import DespesasGrid from "../../components/tables/DespesasGrid";

export default function Despesas() {
  const { isOpen: isModalOpen, openModal: openModal, closeModal: closeModal } = useModal();
  return (
    <>
      <PageMeta 
        title="Despesas - Financeiro" 
        description="Gerencie todas as despesas do instituto"
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Despesas" />

        {/* Header Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-900/20">
                <DollarLineIcon className="text-red-600 size-6 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Gestão de Despesas
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Controle todas as despesas e gastos do instituto
                </p>
              </div>
            </div>
            <button 
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <PlusIcon className="size-4" />
              Lançar Despesa
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Despesas Mês
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                R$ 12.450,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pago Hoje
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                R$ 890,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pendente
              </h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                R$ 2.340,00
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Em Atraso
              </h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                R$ 750,00
              </p>
            </div>
          </div>

          {/* Grid de Despesas */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <DespesasGrid />
          </div>
        </div>
      </div>

      {/* Modal Nova Despesa */}
      <ModalNovaDespesa isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
