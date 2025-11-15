import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import LogsGrid from "../../components/tables/LogsGrid/LogsGrid";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useModal } from "../../hooks/useModal";

// Tipos para os filtros (conforme API backend)
export interface LogFilters {
  page?: number;
  pageSize?: number;
  nivel?: number | null; // 0=Info, 1=Warning, 2=Error, 3=Fatal
  jornadaCritica?: boolean | null;
  dataInicio?: string;
  dataFim?: string;
  usrAcao?: string; // Guid do usuário
  ip?: string;
}

// Opções de nível (criticidade)
const NIVEL_OPTIONS = [
  { label: "Todas", value: "" },
  { label: "Info", value: "0" },
  { label: "Warning", value: "1" },
  { label: "Error", value: "2" },
  { label: "Fatal", value: "3" },
];

// Opções de jornada crítica
const JORNADA_CRITICA_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Sim", value: "true" },
  { label: "Não", value: "false" },
];

export default function Log() {
  const {
    isOpen: showFilters,
    openModal: openFilters,
    closeModal: closeFilters,
  } = useModal();

  // Estados dos filtros
  const [filters, setFilters] = useState<LogFilters>({
    page: 1,
    pageSize: 50,
    nivel: null,
    jornadaCritica: null,
    dataInicio: "",
    dataFim: "",
    usrAcao: "",
    ip: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<LogFilters | undefined>(undefined);

  // Função para aplicar filtros
  const handleApplyFilters = () => {
    const filtersToApply: LogFilters = {
      page: 1,
      pageSize: 50,
    };
    
    if (filters.dataInicio) filtersToApply.dataInicio = filters.dataInicio;
    if (filters.dataFim) filtersToApply.dataFim = filters.dataFim;
    if (filters.usrAcao) filtersToApply.usrAcao = filters.usrAcao;
    if (filters.nivel !== null && filters.nivel !== undefined) filtersToApply.nivel = filters.nivel;
    if (filters.jornadaCritica !== null && filters.jornadaCritica !== undefined) filtersToApply.jornadaCritica = filters.jornadaCritica;
    if (filters.ip) filtersToApply.ip = filters.ip;

    setAppliedFilters(filtersToApply);
    closeFilters();
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 50,
      nivel: null,
      jornadaCritica: null,
      dataInicio: "",
      dataFim: "",
      usrAcao: "",
      ip: "",
    });
    setAppliedFilters(undefined);
  };

  // Verificar se há filtros ativos
  const activeFiltersCount = Object.entries(appliedFilters || {}).filter(
    ([key, value]) => {
      if (key === "page" || key === "pageSize") return false;
      return value !== "" && value !== undefined && value !== null;
    }
  ).length;

  return (
    <>
      <PageMeta
        title="Logs do Sistema - Rastreabilidade"
        description="Visualize e monitore todos os logs de atividades do sistema"
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Logs do Sistema" />

        {/* Header Section com Filtros */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Rastreabilidade de Logs
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitore todas as atividades e eventos do sistema
                </p>
              </div>
            </div>

            {/* Botão de Filtros */}
            <Button
              onClick={showFilters ? closeFilters : openFilters}
              variant="outline"
              className="gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilters ? 'Ocultar Filtros' : 'Filtros'}
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Seção de Filtros Expansível */}
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros de Busca
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Filtro: Data Início */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Data Início
                  </Label>
                  <Input
                    type="date"
                    value={filters.dataInicio || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, dataInicio: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                {/* Filtro: Data Fim */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Data Fim
                  </Label>
                  <Input
                    type="date"
                    value={filters.dataFim || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, dataFim: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                {/* Filtro: ID do Usuário (Guid) */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    ID do Usuário (Guid)
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ex: 00000000-0000-0000-0000-000000000000"
                    value={filters.usrAcao || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, usrAcao: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                {/* Filtro: Nível (Criticidade) */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Nível (Criticidade)
                  </Label>
                  <Select
                    options={NIVEL_OPTIONS}
                    value={filters.nivel !== null && filters.nivel !== undefined ? String(filters.nivel) : ""}
                    onChange={(value) =>
                      setFilters({ ...filters, nivel: value === "" ? null : Number(value) })
                    }
                    placeholder="Selecione"
                    className="w-full"
                  />
                </div>

                {/* Filtro: Jornada Crítica */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Jornada Crítica
                  </Label>
                  <Select
                    options={JORNADA_CRITICA_OPTIONS}
                    value={filters.jornadaCritica !== null && filters.jornadaCritica !== undefined ? String(filters.jornadaCritica) : ""}
                    onChange={(value) =>
                      setFilters({ ...filters, jornadaCritica: value === "" ? null : value === "true" })
                    }
                    placeholder="Selecione"
                    className="w-full"
                  />
                </div>

                {/* Filtro: Endereço IP */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Endereço IP
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ex: 192.168.1.1"
                    value={filters.ip || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, ip: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Botões de Ação dos Filtros */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleApplyFilters}
                  className="gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Aplicar Filtros
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}

          {/* Indicador de Filtros Ativos */}
          {activeFiltersCount > 0 && !showFilters && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {activeFiltersCount} filtro(s) ativo(s)
              </span>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Limpar todos
              </button>
            </div>
          )}

          {/* Grid de Logs */}
          <LogsGrid filters={appliedFilters} />
        </div>
      </div>
    </>
  );
}
