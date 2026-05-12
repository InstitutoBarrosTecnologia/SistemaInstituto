import { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { FinancialTransactionService, TransactionFilters } from "../../services/service/FinancialTransactionService";
import { FinancialTransactionResponseDto } from "../../services/model/Dto/Response/FinancialTransactionResponseDto";
import { ETipoTransacao } from "../../services/model/Enum/ETipoTransacao";
import { EDespesaStatus } from "../../services/model/Enum/EDespesaStatus";
import { useSortedPaginated, ColDef } from "../../hooks/useSortedPaginated";

const TIPO_MAP: Record<number, string> = { 1: "Despesa", 2: "Recebimento" };
const STATUS_MAP: Record<number, string> = { 1: "Pendente", 2: "Aprovada", 3: "Cancelada", 4: "Concluída" };

function fmtDate(val: unknown): string {
  if (!val) return "—";
  const d = new Date(val as string);
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString("pt-BR");
}

function fmtBrl(val: unknown): string {
  if (val == null) return "—";
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type T = FinancialTransactionResponseDto;

const COLS: ColDef[] = [
  { key: "nomeDespesa",          type: "string",   accessor: (r) => (r as T).nomeDespesa },
  { key: "tipo",                 type: "string",   accessor: (r) => TIPO_MAP[(r as T).tipo] ?? "" },
  { key: "status",               type: "string",   accessor: (r) => STATUS_MAP[(r as T).status] ?? "" },
  { key: "valores",              type: "currency", accessor: (r) => (r as T).valores },
  { key: "formaPagamento",       type: "string",   accessor: (r) => (r as T).formaPagamento },
  { key: "nomeUnidade",          type: "string",   accessor: (r) => (r as T).nomeUnidade },
  { key: "dataVencimento",       type: "date",     accessor: (r) => (r as T).dataVencimento },
  { key: "usrDescricaoCadastro", type: "string",   accessor: (r) => (r as T).usrDescricaoCadastro },
  { key: "dataCadastro",         type: "date",     accessor: (r) => (r as T).dataCadastro },
];

const COL_HEADERS: { key: string; label: string }[] = [
  { key: "nomeDespesa",          label: "Nome" },
  { key: "tipo",                 label: "Tipo" },
  { key: "status",               label: "Status" },
  { key: "valores",              label: "Valor" },
  { key: "formaPagamento",       label: "Forma Pgto" },
  { key: "nomeUnidade",          label: "Unidade" },
  { key: "dataVencimento",       label: "Vencimento" },
  { key: "usrDescricaoCadastro", label: "Cadastrado Por" },
  { key: "dataCadastro",         label: "Data Cadastro" },
];

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <span className={`ml-1 inline-flex flex-col leading-none ${active ? "text-blue-500" : "text-gray-400"}`}>
      <span className={`text-[8px] ${active && direction === "asc" ? "opacity-100" : "opacity-40"}`}>▲</span>
      <span className={`text-[8px] ${active && direction === "desc" ? "opacity-100" : "opacity-40"}`}>▼</span>
    </span>
  );
}

function Pagination({
  page, totalPages, onPage,
}: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700">
        ‹
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-400">…</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)}
            className={`rounded px-2.5 py-1 text-sm font-medium transition ${p === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700">
        ›
      </button>
    </div>
  );
}

export default function RelatorioFinanceiro() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [dataFim, setDataFim] = useState(() => {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [tipo, setTipo] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [formaPagamento, setFormaPagamento] = useState("");

  const limparFiltros = useCallback(() => {
    const hoje = new Date();
    const inicio = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
    const fimD = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const fim = `${fimD.getFullYear()}-${String(fimD.getMonth() + 1).padStart(2, "0")}-${String(fimD.getDate()).padStart(2, "0")}`;
    setDataInicio(inicio);
    setDataFim(fim);
    setTipo("");
    setStatus("");
    setFormaPagamento("");
  }, []);

  const buscar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filtros: TransactionFilters = {};
      if (dataInicio) filtros.dataInicio = dataInicio;
      if (dataFim) filtros.dataFim = dataFim;
      if (tipo) filtros.tipo = Number(tipo) as ETipoTransacao;
      if (status) filtros.status = Number(status) as EDespesaStatus;
      const result = await FinancialTransactionService.getAll(filtros);
      let filtered = result ?? [];
      if (formaPagamento.trim()) {
        const q = formaPagamento.toLowerCase();
        filtered = filtered.filter((t) => t.formaPagamento?.toLowerCase().includes(q));
      }
      setItems(filtered);
    } catch {
      setError("Erro ao buscar transações financeiras.");
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim, tipo, status, formaPagamento]);

  useEffect(() => { buscar(); }, []);

  const { sorted, paginated, sort, toggleSort, page, setPage, totalPages } = useSortedPaginated<T>(
    items, COLS, { key: "dataVencimento", direction: "desc" }
  );

  const totalReceitas = useMemo(() => items.filter((t) => t.tipo === 2).reduce((s, t) => s + (t.valores ?? 0), 0), [items]);
  const totalDespesas = useMemo(() => items.filter((t) => t.tipo === 1).reduce((s, t) => s + (t.valores ?? 0), 0), [items]);
  const saldo = totalReceitas - totalDespesas;

  const exportExcel = () => {
    const rows = sorted.map((t) => ({
      ID: t.id ?? "",
      Nome: t.nomeDespesa,
      Tipo: TIPO_MAP[t.tipo] ?? t.tipo,
      Status: STATUS_MAP[t.status] ?? t.status,
      Valor: t.valores,
      "Forma Pagamento": t.formaPagamento,
      Conta: t.conta,
      Unidade: t.nomeUnidade,
      "Data Vencimento": fmtDate(t.dataVencimento),
      Descrição: t.descricao ?? "",
      "Cadastrado Por": t.usrDescricaoCadastro ?? "",
      "Data Cadastro": fmtDate(t.dataCadastro),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financeiro");
    XLSX.writeFile(wb, `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportCsv = () => {
    const header = ["ID", "Nome", "Tipo", "Status", "Valor", "Forma Pagamento", "Conta", "Unidade", "Data Vencimento", "Descrição", "Cadastrado Por", "Data Cadastro"];
    const rows = sorted.map((t) => [
      `"${t.id ?? ""}"`,
      `"${t.nomeDespesa ?? ""}"`,
      `"${TIPO_MAP[t.tipo] ?? t.tipo}"`,
      `"${STATUS_MAP[t.status] ?? t.status}"`,
      t.valores ?? 0,
      `"${t.formaPagamento ?? ""}"`,
      `"${t.conta ?? ""}"`,
      `"${t.nomeUnidade ?? ""}"`,
      `"${fmtDate(t.dataVencimento)}"`,
      `"${(t.descricao ?? "").replace(/"/g, "'")}"`,
      `"${(t.usrDescricaoCadastro ?? "").replace(/"/g, "'")}"`,
      `"${fmtDate(t.dataCadastro)}"`,
    ]);
    const csv = [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

  return (
    <>
      <PageMeta title="Relatório Financeiro" description="Relatório de transações financeiras com filtros e exportação" />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Relatório Financeiro" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl dark:bg-green-900/20">
                <svg className="text-green-600 size-5 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">Relatório Financeiro</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {items.length} registro{items.length !== 1 ? "s" : ""}
                  {totalPages > 1 && ` — página ${page} de ${totalPages}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCsv} disabled={items.length === 0} className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                CSV
              </button>
              <button onClick={exportExcel} disabled={items.length === 0} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-40">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                Excel
              </button>
            </div>
          </div>

          {/* Cards resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Total Receitas</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{fmtBrl(totalReceitas)}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/10">
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Total Despesas</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">{fmtBrl(totalDespesas)}</p>
            </div>
            <div className={`rounded-xl border p-4 ${saldo >= 0 ? "border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-900/10" : "border-orange-200 bg-orange-50 dark:border-orange-900/40 dark:bg-orange-900/10"}`}>
              <p className={`text-xs font-medium mb-1 ${saldo >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>Saldo</p>
              <p className={`text-xl font-bold ${saldo >= 0 ? "text-blue-700 dark:text-blue-300" : "text-orange-700 dark:text-orange-300"}`}>{fmtBrl(saldo)}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-900/20 dark:border-gray-700">
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Data Início</label>
              <input type="date" className={inputClass} value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Data Fim</label>
              <input type="date" className={inputClass} value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Tipo</label>
              <select className={inputClass} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Todos</option>
                <option value="1">Despesa</option>
                <option value="2">Recebimento</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="1">Pendente</option>
                <option value="2">Aprovada</option>
                <option value="3">Cancelada</option>
                <option value="4">Concluída</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Forma de Pagamento</label>
              <input type="text" className={inputClass} placeholder="Ex: Pix, Cartão..." value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} />
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
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</div>
          )}

          {/* Tabela */}
          {loading ? (
            <div className="text-center py-10 text-gray-400">Carregando...</div>
          ) : items.length === 0 ? (
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
                    {paginated.map((t, i) => (
                      <tr key={t.id ?? i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white max-w-[200px] truncate">{t.nomeDespesa}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${t.tipo === 2 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                            {TIPO_MAP[t.tipo] ?? t.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {STATUS_MAP[t.status] ?? t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white whitespace-nowrap">{fmtBrl(t.valores)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.formaPagamento ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.nomeUnidade ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtDate(t.dataVencimento)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.usrDescricaoCadastro ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtDate(t.dataCadastro)}</td>
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
