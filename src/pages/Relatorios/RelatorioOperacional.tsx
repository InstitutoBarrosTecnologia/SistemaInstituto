import { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { getAllOrderServicesAsync } from "../../services/service/OrderServiceService";
import { getAllCategoriasAsync } from "../../services/service/ServiceCategoryService";
import { getAllCustomersAsync } from "../../services/service/CustomerService";
import { OrderServiceResponseDto } from "../../services/model/Dto/Response/OrderServiceResponseDto";
import { CategoryServiceResponseDto } from "../../services/model/Dto/Response/CategoryServiceResponseDto";
import { useSortedPaginated, ColDef } from "../../hooks/useSortedPaginated";
import SelectWithSearch, { Option } from "../../components/form/SelectWithSearch";

const STATUS_MAP: Record<number, string> = {
  0: "Aberto", 1: "Análise", 2: "Aprovado", 3: "Rejeitado",
  4: "Andamento", 5: "Teste", 6: "Concluído",
};

const FORMA_PAGAMENTO_MAP: Record<number, string> = {
  0: "A Definir", 1: "Dinheiro", 2: "Cartão Débito", 3: "Cartão Crédito",
  4: "Pix", 5: "Boleto", 6: "Transferência", 7: "Outros",
};

function fmtBrl(val: unknown): string {
  if (val == null) return "—";
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(val: unknown): string {
  if (!val) return "—";
  const d = new Date(val as string);
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString("pt-BR");
}

function mesAtualInicio(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function mesAtualFim(): string {
  const d = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type OS = OrderServiceResponseDto;
type NomeObj = { nome?: string };

/** Retorna os nomes de serviços da OS concatenados */
function getServicosNomes(os: OS): string {
  return (os.servicos ?? []).map((s) => s.descricao ?? "").filter(Boolean).join(", ") || "—";
}

/** Retorna os nomes de categoria da OS concatenados (lookup pelo categoriaId) */
function getCategoriaTitulo(os: OS, categorias: CategoryServiceResponseDto[]): string {
  const ids = (os.servicos ?? [])
    .map((s) => s.subCategoriaServico?.categoriaId ?? "")
    .filter(Boolean);
  const unicos = [...new Set(ids)];
  const nomes = unicos
    .map((id) => categorias.find((c) => c.id === id)?.titulo ?? "")
    .filter(Boolean);
  return nomes.join(", ") || "—";
}

/** Retorna o categoriaId do primeiro serviço (para filtro) */
function getCategoriasIds(os: OS): string[] {
  return (os.servicos ?? [])
    .map((s) => s.subCategoriaServico?.categoriaId ?? "")
    .filter(Boolean);
}

/** Retorna o nome do fisioterapeuta da sessão realizada mais recente */
function getUltimoFisio(os: OS): string {
  const realizadas = (os.sessoes ?? []).filter((s) => s.statusSessao === 0);
  if (realizadas.length === 0) return "—";
  realizadas.sort((a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime());
  return (realizadas[0].funcionario as { nome?: string } | undefined)?.nome ?? "—";
}

const COLS: ColDef[] = [
  { key: "referencia",            type: "string",   accessor: (r) => (r as OS).referencia },
  { key: "status",                type: "string",   accessor: (r) => STATUS_MAP[(r as OS).status] ?? "" },
  { key: "paciente",              type: "string",   accessor: (r) => ((r as OS).cliente as NomeObj)?.nome },
  { key: "fisioterapeuta",        type: "string",   accessor: (r) => ((r as OS).funcionario as NomeObj)?.nome },
  { key: "servicos",              type: "string",   accessor: (r) => getServicosNomes(r as OS) },
  { key: "categoria",             type: "string",   accessor: () => "" }, // preenchido dentro do componente
  { key: "ultimoFisio",           type: "string",   accessor: (r) => getUltimoFisio(r as OS) },
  { key: "formaPagamento",        type: "string",   accessor: (r) => FORMA_PAGAMENTO_MAP[(r as OS).formaPagamento] ?? "" },
  { key: "preco",                 type: "currency", accessor: (r) => (r as OS).precoDescontado ?? (r as OS).precoOrdem },
  { key: "sessoes",               type: "number",   accessor: (r) => (r as OS).qtdSessaoRealizada },
  { key: "dataConclusaoServico",  type: "date",     accessor: (r) => (r as OS).dataConclusaoServico },
  { key: "usrCadastroDesc",       type: "string",   accessor: (r) => (r as OS).usrDescricaoCadastro ?? (r as OS).usrCadastroDesc },
  { key: "dataCadastro",          type: "date",     accessor: (r) => (r as OS).dataCadastro },
];

const COL_HEADERS: { key: string; label: string }[] = [
  { key: "referencia",           label: "Referência" },
  { key: "status",               label: "Status" },
  { key: "paciente",             label: "Paciente" },
  { key: "fisioterapeuta",       label: "Fisioterapeuta" },
  { key: "servicos",             label: "Serviços" },
  { key: "categoria",            label: "Categoria" },
  { key: "ultimoFisio",          label: "Último Fisio" },
  { key: "formaPagamento",       label: "Forma Pgto" },
  { key: "preco",                label: "Preço" },
  { key: "sessoes",              label: "Sessões" },
  { key: "dataConclusaoServico", label: "Conclusão" },
  { key: "usrCadastroDesc",      label: "Cadastrado Por" },
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

export default function RelatorioOperacional() {
  const [items, setItems] = useState<OS[]>([]);
  const [categorias, setCategorias] = useState<CategoryServiceResponseDto[]>([]);
  const [optionsCliente, setOptionsCliente]           = useState<Option[]>([]);
  const [optionsCadastradoPor, setOptionsCadastradoPor] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros de data (client-side) — inicializados no mês atual
  const [dataInicio, setDataInicio] = useState(mesAtualInicio);
  const [dataFim, setDataFim]       = useState(mesAtualFim);

  // Filtros client-side
  const [statusFiltro,    setStatusFiltro]    = useState<string>("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [clienteId,       setClienteId]       = useState<string>("");
  const [cadastradoPorId, setCadastradoPorId] = useState<string>("");

  const limparFiltros = useCallback(() => {
    setDataInicio(mesAtualInicio());
    setDataFim(mesAtualFim());
    setStatusFiltro("");
    setCategoriaFiltro("");
    setClienteId("");
    setCadastradoPorId("");
  }, []);

  const buscar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllOrderServicesAsync();
      
      // Extrair lista única de usuários que cadastraram OSs (usando NOME como value e label)
      if (Array.isArray(result)) {
        const usuariosSet = new Set<string>();
        result.forEach(os => {
          const nomeUsuario = os.usrDescricaoCadastro ?? os.usrCadastroDesc;
          if (nomeUsuario && nomeUsuario.trim() !== "") {
            usuariosSet.add(nomeUsuario);
          }
        });
        
        const optionsUsuarios: Option[] = Array.from(usuariosSet)
          .map(nome => ({ value: nome, label: nome }))
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setOptionsCadastradoPor(optionsUsuarios);
      }
      
      setItems(Array.isArray(result) ? result : []);
    } catch {
      setError("Erro ao buscar ordens de serviço.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca listas de suporte uma única vez
  useEffect(() => {
    getAllCategoriasAsync()
      .then((res) => { if (Array.isArray(res)) setCategorias(res); })
      .catch(() => {});

    getAllCustomersAsync()
      .then((res) => {
        if (Array.isArray(res)) {
          setOptionsCliente(
            res
              .filter((c) => c.id && c.nome)
              .map((c) => ({ value: c.id!, label: c.nome! }))
              .sort((a, b) => a.label.localeCompare(b.label))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { buscar(); }, []);

  const itensFiltrados = useMemo(() => {
    const inicio = dataInicio ? new Date(dataInicio + "T00:00:00") : null;
    const fim    = dataFim    ? new Date(dataFim    + "T23:59:59") : null;

    const resultado = items.filter((os) => {
      // Filtro data cadastro
      if (inicio || fim) {
        const dc = os.dataCadastro ? new Date(os.dataCadastro) : null;
        if (!dc) return false;
        if (inicio && dc < inicio) return false;
        if (fim    && dc > fim)    return false;
      }
      // Status
      if (statusFiltro !== "" && os.status !== Number(statusFiltro)) return false;
      // Categoria
      if (categoriaFiltro && categoriaFiltro.trim() !== "") {
        const ids = getCategoriasIds(os);
        if (!ids.includes(categoriaFiltro)) return false;
      }
      // Paciente (por ID)
      if (clienteId && clienteId.trim() !== "") {
        if (os.clienteId !== clienteId) return false;
      }
      // Cadastrado Por (por NOME de usuário) - filtra por quem CADASTROU a OS
      if (cadastradoPorId && cadastradoPorId.trim() !== "") {
        const nomeUsuarioOS = os.usrDescricaoCadastro ?? os.usrCadastroDesc ?? "";
        if (nomeUsuarioOS !== cadastradoPorId) {
          return false;
        }
      }
      return true;
    });

    return resultado;
  }, [items, dataInicio, dataFim, statusFiltro, categoriaFiltro, clienteId, cadastradoPorId]);

  const cols = useMemo<ColDef[]>(() => COLS.map((c) =>
    c.key === "categoria"
      ? { ...c, accessor: (r) => getCategoriaTitulo(r as OS, categorias) }
      : c
  ), [categorias]);

  const { sorted, paginated, sort, toggleSort, page, setPage, totalPages } = useSortedPaginated<OS>(
    itensFiltrados, cols, { key: "dataCadastro", direction: "desc" }
  );

  const totalFaturamento       = useMemo(() => itensFiltrados.reduce((s, os) => s + (os.precoDescontado ?? os.precoOrdem ?? 0), 0), [itensFiltrados]);
  const totalSessoesRealizadas = useMemo(() => itensFiltrados.reduce((s, os) => s + (os.qtdSessaoRealizada ?? 0), 0), [itensFiltrados]);

  const exportExcel = () => {
    const rows = sorted.map((os) => ({
      ID: os.id ?? "",
      Referência: os.referencia ?? "—",
      Status: STATUS_MAP[os.status] ?? os.status,
      Paciente: (os.cliente as NomeObj)?.nome ?? "—",
      Fisioterapeuta: (os.funcionario as NomeObj)?.nome ?? "—",
      Serviços: getServicosNomes(os),
      Categoria: getCategoriaTitulo(os, categorias),
      "Último Fisio": getUltimoFisio(os),
      "Forma Pagamento": FORMA_PAGAMENTO_MAP[os.formaPagamento] ?? os.formaPagamento,
      "Preço Total": os.precoOrdem ?? 0,
      "Preço c/ Desconto": os.precoDescontado ?? 0,
      "Sessões Total": os.qtdSessaoTotal ?? 0,
      "Sessões Realizadas": os.qtdSessaoRealizada ?? 0,
      "Data Conclusão": fmtDate(os.dataConclusaoServico),
      "Cadastrado Por": os.usrDescricaoCadastro ?? os.usrCadastroDesc ?? "—",
      "Data Cadastro": fmtDate(os.dataCadastro),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Operacional");
    XLSX.writeFile(wb, `relatorio-operacional-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportCsv = () => {
    const header = [
      "ID", "Referência", "Status", "Paciente", "Fisioterapeuta", "Serviços", "Categoria", "Último Fisio",
      "Forma Pagamento", "Preço Total", "Preço c/ Desconto",
      "Sessões Total", "Sessões Realizadas", "Data Conclusão", "Cadastrado Por", "Data Cadastro",
    ];
    const rows = sorted.map((os) => [
      `"${os.id ?? ""}"`,
      `"${os.referencia ?? ""}"`,
      `"${STATUS_MAP[os.status] ?? os.status}"`,
      `"${(os.cliente as NomeObj)?.nome ?? ""}"`,
      `"${(os.funcionario as NomeObj)?.nome ?? ""}"`,
      `"${getServicosNomes(os).replace(/"/g, "'")}"`,
      `"${getCategoriaTitulo(os, categorias).replace(/"/g, "'")}"`,
      `"${getUltimoFisio(os).replace(/"/g, "'")}"`,
      `"${FORMA_PAGAMENTO_MAP[os.formaPagamento] ?? os.formaPagamento}"`,
      os.precoOrdem ?? 0,
      os.precoDescontado ?? 0,
      os.qtdSessaoTotal ?? 0,
      os.qtdSessaoRealizada ?? 0,
      `"${fmtDate(os.dataConclusaoServico)}"`,
      `"${((os.usrDescricaoCadastro ?? os.usrCadastroDesc) ?? "").replace(/"/g, "'")}"`,
      `"${fmtDate(os.dataCadastro)}"`,
    ]);
    const csv = [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-operacional-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

  return (
    <>
      <PageMeta title="Relatório Operacional" description="Relatório de ordens de serviço e sessões com filtros e exportação" />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Relatório Operacional" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl dark:bg-purple-900/20">
                <svg className="text-purple-600 size-5 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">Relatório Operacional</h1>
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

          {/* Cards resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/40 dark:bg-purple-900/10">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Total de OS</p>
              <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{itensFiltrados.length}</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Sessões Realizadas</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{totalSessoesRealizadas}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Faturamento Total</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{fmtBrl(totalFaturamento)}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-900/20 dark:border-gray-700">
            {/* Linha 1 — data */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Data Cadastro (De)</label>
              <input type="date" className={inputClass} value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Data Cadastro (Até)</label>
              <input type="date" className={inputClass} value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>

            {/* Divisor */}
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />

            {/* Linha 2 — demais filtros */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
              <select className={inputClass} value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Categoria de Serviço</label>
              <select className={inputClass} value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id ?? ""}>{c.titulo}</option>
                ))}
              </select>
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
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Cadastrado Por</label>
              <SelectWithSearch
                options={optionsCadastradoPor}
                value={cadastradoPorId}
                onChange={setCadastradoPorId}
                placeholder="Buscar usuário..."
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={buscar} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                Recarregar
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
                    {paginated.map((os, i) => (
                      <tr key={os.id ?? i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{os.referencia ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {STATUS_MAP[os.status] ?? os.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(os.cliente as NomeObj)?.nome ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(os.funcionario as NomeObj)?.nome ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[200px] truncate" title={getServicosNomes(os)}>
                          {getServicosNomes(os)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{getCategoriaTitulo(os, categorias)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{getUltimoFisio(os)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{FORMA_PAGAMENTO_MAP[os.formaPagamento] ?? os.formaPagamento}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white whitespace-nowrap">{fmtBrl(os.precoDescontado ?? os.precoOrdem)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{os.qtdSessaoRealizada ?? 0}/{os.qtdSessaoTotal ?? 0}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtDate(os.dataConclusaoServico)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{os.usrDescricaoCadastro ?? os.usrCadastroDesc ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{fmtDate(os.dataCadastro)}</td>
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
