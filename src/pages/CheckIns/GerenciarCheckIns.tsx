import { Toaster } from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SessionsGrid from "../../components/tables/SessionsGrid/SessionsGrid";

export default function GerenciarCheckIns() {
  return (
    <>
      <PageMeta
        title="Gerenciar Check-ins"
        description="Visualize e gerencie todos os check-ins realizados no sistema"
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Gerenciar Check-ins" />

        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="text-blue-600 size-6 dark:text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Gerenciar Check-ins
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Lista completa de todos os check-ins realizados. Você pode
                filtrar e excluir registros incorretos.
              </p>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <SessionsGrid />
      </div>

      <Toaster position="bottom-right" />
    </>
  );
}
