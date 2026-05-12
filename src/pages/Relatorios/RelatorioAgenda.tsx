import { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { getAllSchedulesAsync } from "../../services/service/ScheduleService";
import { getAllCustomersAsync } from "../../services/service/CustomerService";
import { EmployeeService } from "../../services/service/EmployeeService";
import { ScheduleResponseDto } from "../../services/model/Dto/Response/ScheduleResponseDto";
import { useSortedPaginated, ColDef } from "../../hooks/useSortedPaginated";
import SelectWithSearch, { Option } from "../../components/form/SelectWithSearch";

const STATUS_MAP: Record<number, string> = {
  0: "A Confirmar", 1: "Finalizado", 2: "Confirmado pelo Paciente", 3: "Em Espera",
  4: "Cancelado pelo Profissional", 5: "Cancelado pelo Paciente", 6: "Faltou",
  7: "Pré-Atendimento", 8: "Reagendar", 9: "Pagamento", 10: "OFF", 11: "Reunião", 12: "Banheira",
};

function fmtDate(val: unknown): string {
  if (!val) return "—";
  const d = new Date(val as string);
  return isNaN(d.getTime()) ? String(val) : d.toLocaleString("pt-BR");
}

type S = ScheduleResponseDto;

const COLS: ColDef[] = [
  { key: "titulo",          type: "string", accessor: (r) => (r as S).titulo },
  { key: "dataInicio",      type: "date",   accessor: (r) => (r as S).dataInicio },
  { key: "dataFim",         type: "date",   accessor: (r) => (r as S).dataFim },
  { key: "status",          type: "string", accessor: (r) => STATUS_MAP[(r as S).status] ?? "" },
  { key: "paciente",        type: "string", accessor: (r) => (r as S).cliente?.nome },
  { key: "fisio",           type: "string", accessor: (r) => (r as S).funcionario?.nome },
  { key: "localizacao",     type: "string", accessor: (r) => (r as S).localizacao },
  { key: "usrCadastroDesc", type: "string", accessor: (r) => (r as S).usrDescricaoCadastro ?? (r as S).usrCadastroDesc },
  { key: "dataCadastro",    type: "date",   accessor: (r) => (r as S).dataCadastro },
];

const COL_HEADERS: { key: string; label: string }[] = [
  { key: "titulo",          label: "Título" },
  { key: "dataInicio",      label: "Data Início" },
  { key: "dataFim",         label: "Data Fim" },
  { key: "status",          label: "Status" },
  { key: "paciente",        label: "Paciente" },
  { key: "fisio",           label: "Fisioterapeuta" },
  { key: "localizacao",     label: "Localização" },
  { key: "usrCadastroDesc", label: "Cadastrado Por" },
  { key: "dataCadastro",    label: "Data Cadastro" },
];

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <span className={`ml-1 inline-flex flex-col leading-none ${active ? "text-blue-500" : "text-gray-400"}`}>
      <span className={`text-[8px] ${active && direction === "asc" ? "opacity-100" : "opacity-40"}`}>▲</span>
      <span className={`text-[8px] ${active && direction === "desc" ? "opacity-100" : "opacity-40"}`}>▼</span>
    </span>
  );
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700">‹</button>
      {pages.map((p, i) =>
        p === "…" ? <span key={`e${i}`} className="px-1 text-gray-400">…</span> : (
          <button key={p} onClick={() => onPage(p as number)}
            className={`rounded px-2.5 py-1 text-sm font-medium transition ${p === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700">›</button>
    </div>
  );
}

export default function RelatorioAgenda() {
  const [items, setItems] = useState<S[]>([]);
  const [optionsCliente, setOptionsCliente]         = useState<Option[]>([]);
  const [optionsFuncionario, setOptionsFuncionario] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros servidor
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [dataFim, setDataFim] = useState(() => {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [statusFiltro, setStatusFiltro] = useState<string>("");

  // Filtros client-side
  const [searchTitulo,    setSearchTitulo]    = useState("");
  const [clienteId,       setClienteId]       = useState("");
  const [funcionarioId,   setFuncionarioId]   = useState("");
  const [apenasAvaliacao, setApenasAvaliacao] = useState(false);

  const limparFiltros = useCallback(() => {
    const hoje = new Date();
    const inicio = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
    const fimD = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const fim = `${fimD.getFullYear()}-${String(fimD.getMonth() + 1).padStart(2, "0")}-${String(fimD.getDate()).padStart(2, "0")}`;
    setDataInicio(inicio);
    setDataFim(fim);
    setStatusFiltro("");
    setSearchTitulo("");
    setClienteId("");
    setFuncionarioId("");
    setApenasAvaliacao(false);
  }, []);

  const buscar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filtros: Record<string, unknown> = {};
      if (dataInicio) filtros.data = dataInicio;
      if (dataFim) filtros.dataFim = dataFim;
      // Só envia status se foi selecionado um valor específico (não "Todos")
      // Isso permite que status 0 (A Confirmar) funcione corretamente
      if (statusFiltro !== "") {
        filtros.status = Number(statusFiltro);
      }
      // Se statusFiltro === "", não adiciona ao filtros, backend receberá null e usará -1
      const result = await getAllSchedulesAsync(filtros as Parameters<typeof getAllSchedulesAsync>[0]);
      setItems(result ?? []);
    } catch {
      setError("Erro ao buscar dados da agenda.");
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim, statusFiltro]);

  useEffect(() => { buscar(); }, []);

  // Carrega listas de suporte uma única vez
  useEffect(() => {
    getAllCustomersAsync()
      .then((res) => {
        if (Array.isArray(res))
          setOptionsCliente(
            res.filter((c) => c.id && c.nome)
               .map((c) => ({ value: c.id!, label: c.nome! }))
               .sort((a, b) => a.label.localeCompare(b.label))
          );
      })
      .catch(() => {});

    EmployeeService.getAll()
      .then((res) => {
        if (Array.isArray(res))
          setOptionsFuncionario(
            res.filter((e) => e.id && e.nome)
               .map((e) => ({ value: e.id!, label: e.nome! }))
          );
      })
      .catch(() => {});
  }, []);

  const itensFiltrados = useMemo(() => {
    const tituloQ = searchTitulo.trim().toLowerCase();

    return items.filter((s) => {
      if (apenasAvaliacao && !s.isAvaliacao) return false;
      if (tituloQ      && !(s.titulo ?? "").toLowerCase().includes(tituloQ)) return false;
      if (clienteId    && s.clienteId     !== clienteId)    return false;
      if (funcionarioId && s.funcionarioId !== funcionarioId) return false;
      return true;
    });
  }, [items, searchTitulo, clienteId, funcionarioId, apenasAvaliacao]);

  const { sorted, paginated, sort, toggleSort, page, setPage, totalPages } = useSortedPaginated<S>(
    itensFiltrados, COLS, { key: "dataInicio", direction: "desc" }
  );

  const exportExcel = () => {
    const rows = sorted.map((s) => ({
      ID: s.id ?? "",
      Título: s.titulo,
      "Data Início": fmtDate(s.dataInicio),
      "Data Fim": fmtDate(s.dataFim),
      Status: STATUS_MAP[s.status] ?? s.status,
      Avaliação: s.isAvaliacao ? "Sim" : "Não",
      Paciente: s.cliente?.nome ?? "—",
      Fisioterapeuta: s.funcionario?.nome ?? "—",
      Localização: s.localizacao ?? "—",
      Observação: s.observacao ?? "—",
      "Cadastrado Por": s.usrDescricaoCadastro ?? s.usrCadastroDesc ?? "—",
      "Data Cadastro": fmtDate(s.dataCadastro),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agenda");
    XLSX.writeFile(wb, `relatorio-agenda-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportCsv = () => {
    const header = ["ID", "Título", "Data Início", "Data Fim", "Status", "Avaliação", "Paciente", "Fisioterapeuta", "Localização", "Observação", "Cadastrado Por", "Data Cadastro"];
    const rows = sorted.map((s) => [
      `"${s.id ?? ""}"`,
      `"${s.titulo ?? ""}"`,
      `"${fmtDate(s.dataInicio)}"`,
      `"${fmtDate(s.dataFim)}"`,
      `"${STATUS_MAP[s.status] ?? s.status}"`,
      `"${s.isAvaliacao ? "Sim" : "Não"}"`,
      `"${s.cliente?.nome ?? ""}"`,
      `"${s.funcionario?.nome ?? ""}"`,
      `"${s.localizacao ?? ""}"`,
      `"${(s.observacao ?? "").replace(/"/g, "'")}"`,
      `"${((s.usrDescricaoCadastro ?? s.usrCadastroDesc) ?? "").replace(/"/g, "'")}"`,
      `"${fmtDate(s.dataCadastro)}"`,
    ]);
    const csv = [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-agenda-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

  return (
    <>
      <PageMeta title="Relatório de Agenda" description="Relatório de agendamentos com filtros e exportação" />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Relatório de Agenda" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl dark:bg-blue-900/20">
                <svg className="text-blue-600 size-5 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">Relatório de Agenda</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {itensFiltrados.length} registro{itensFiltrados.length !== 1 ? "s" : ""}
                  {totalPages > 1 && ` — página ${page} de ${totalPages}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCsv} disabled={itensFiltrados.length === 0} className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                CSV
              </button>
              <button onClick={exportExcel} disabled={itensFiltrados.length === 0} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-40">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                Excel
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-900/20 dark:border-gray-700">
            {/* Linha 1 — filtros de servidor */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Data Início</label>
              <input type="date" className={inputClass} value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Data Fim</label>
              <input type="date" className={inputClass} value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
              <select className={inputClass} value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={buscar} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                Filtrar
              </button>
              <button onClick={limparFiltros} className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Limpar
              </button>
            </div>

            {/* Divisor */}
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />

            {/* Linha 2 — filtros client-side */}
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Título</label>
              <input type="text" className={inputClass} placeholder="Buscar por título..." value={searchTitulo} onChange={(e) => setSearchTitulo(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 min-w-[220px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Paciente</label>
              <SelectWithSearch
                options={optionsCliente}
                value={clienteId}
                onChange={setClienteId}
                placeholder="Buscar paciente..."
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[220px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Fisioterapeuta</label>
              <SelectWithSearch
                options={optionsFuncionario}
                value={funcionarioId}
                onChange={setFuncionarioId}
                placeholder="Buscar fisioterapeuta..."
              />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setApenasAvaliacao((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${apenasAvaliacao ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${apenasAvaliacao ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Apenas avaliações</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</div>
          )}

          {/* Tabela */}
          {loading ? (
            <div className="text-center py-10 text-gray-400">Carregando...</div>
          ) : itensFiltrados.length === 0 ? (
            <div className="text-center py-10 text-gray-400">Nenhum registro encontrado.</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      {COL_HEADERS.map(({ key, label }) => (
                        <th
                          key={key}
                          onClick={() => toggleSort(key)}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          {label}
                          <SortIcon active={sort.key === key} direction={sort.direction} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {paginated.map((s, i) => (
                      <tr key={s.id ?? i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white max-w-[200px] truncate">
                          <span className="flex items-center gap-1.5">
                            {s.isAvaliacao && (
                              <span title="Avaliação" className="inline-flex items-center rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 shrink-0">
                                Aval.
                              </span>
                            )}
                            {s.titulo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtDate(s.dataInicio)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtDate(s.dataFim)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {STATUS_MAP[s.status] ?? s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.cliente?.nome ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.funcionario?.nome ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.localizacao ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.usrDescricaoCadastro ?? s.usrCadastroDesc ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtDate(s.dataCadastro)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
