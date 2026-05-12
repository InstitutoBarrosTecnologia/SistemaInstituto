import { useState, useEffect } from "react";
import { BranchOfficeService } from "../../services/service/BranchOfficeService";
import EmployeeService from "../../services/service/EmployeeService";

export interface DashboardFilterValues {
  periodo?: string;
  dataInicio?: string;
  dataFim?: string;
  filialId?: string;
  funcionarioId?: string;
  formaPagamento?: string;
}

interface DashboardFiltersProps {
  variant: "financeiro" | "operacional";
  onChange: (filters: DashboardFilterValues) => void;
}

const QUICK_PERIODS = [
  { label: "Hoje", value: "dia" },
  { label: "Semana", value: "semana" },
  { label: "Mês", value: "mes" },
];

const FORMAS_PAGAMENTO = [
  { value: "", label: "Todas" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "credito", label: "Cartão de Crédito" },
  { value: "debito", label: "Cartão de Débito" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "transferencia", label: "Transferência" },
];

export default function DashboardFilters({ variant, onChange }: DashboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [periodo, setPeriodo] = useState<string>("mes");
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  const [filialId, setFilialId] = useState<string>("");
  const [funcionarioId, setFuncionarioId] = useState<string>("");
  const [formaPagamento, setFormaPagamento] = useState<string>("");

  const [filiaisOptions, setFiliaisOptions] = useState<{ value: string; label: string }[]>([]);
  const [funcionariosOptions, setFuncionariosOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    BranchOfficeService.getAll()
      .then((data: any[]) => {
        setFiliaisOptions([
          { value: "", label: "Todas as Unidades" },
          ...data.map((f) => ({ value: f.id, label: f.nomeFilial })),
        ]);
      })
      .catch(() => {});

    if (variant === "operacional") {
      EmployeeService.getAll()
        .then((data: any[]) => {
          setFuncionariosOptions([
            { value: "", label: "Todos os Fisioterapeutas" },
            ...data.map((f) => ({ value: f.id, label: f.nome })),
          ]);
        })
        .catch(() => {});
    }
  }, [variant]);

  const buildFilters = (overrides?: Partial<DashboardFilterValues>): DashboardFilterValues => {
    const base: DashboardFilterValues = {
      ...(useCustomDate
        ? { dataInicio: dataInicio || undefined, dataFim: dataFim || undefined }
        : { periodo }),
      filialId: filialId || undefined,
      funcionarioId: funcionarioId || undefined,
      formaPagamento: formaPagamento || undefined,
    };
    return { ...base, ...overrides };
  };

  const applyFilters = () => {
    onChange(buildFilters());
  };

  const handleQuickPeriod = (value: string) => {
    setPeriodo(value);
    setUseCustomDate(false);
    onChange({
      periodo: value,
      dataInicio: undefined,
      dataFim: undefined,
      filialId: filialId || undefined,
      funcionarioId: funcionarioId || undefined,
      formaPagamento: formaPagamento || undefined,
    });
  };

  const handleReset = () => {
    setPeriodo("mes");
    setUseCustomDate(false);
    setDataInicio("");
    setDataFim("");
    setFilialId("");
    setFuncionarioId("");
    setFormaPagamento("");
    onChange({ periodo: "mes" });
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-xl"
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span>Filtros</span>
          {!isOpen && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {useCustomDate
                ? `${dataInicio || "—"} a ${dataFim || "—"}`
                : QUICK_PERIODS.find((p) => p.value === periodo)?.label ?? periodo}
              {filialId && ` · ${filiaisOptions.find((f) => f.value === filialId)?.label ?? ""}`}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible body */}
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-4 space-y-4">
          {/* Quick period buttons */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Período rápido</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handleQuickPeriod(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    !useCustomDate && periodo === p.value
                      ? "bg-brand-500 text-white border-brand-500"
                      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUseCustomDate(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  useCustomDate
                    ? "bg-brand-500 text-white border-brand-500"
                    : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                Personalizado
              </button>
            </div>
          </div>

          {/* Custom date range */}
          {useCustomDate && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {/* Second row: Unidade + extra filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Unidade */}
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Unidade</label>
              <select
                value={filialId}
                onChange={(e) => setFilialId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {filiaisOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Forma de pagamento — apenas dashboard financeiro */}
            {variant === "financeiro" && (
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Forma de Pagamento</label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {FORMAS_PAGAMENTO.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Fisioterapeuta — apenas dashboard operacional */}
            {variant === "operacional" && (
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fisioterapeuta</label>
                <select
                  value={funcionarioId}
                  onChange={(e) => setFuncionarioId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {funcionariosOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
