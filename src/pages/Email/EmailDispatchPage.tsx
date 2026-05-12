import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EmailDispatchService from "../../services/service/EmailDispatchService";
import EmailConfigurationService from "../../services/service/EmailConfigurationService";
import { getAllCustomersAsync } from "../../services/service/CustomerService";
import {
  EmailDispatchRequestDto,
  EmailDispatchResponseDto,
  EmailConfigurationResponseDto,
} from "../../services/model/email.types";
import { CustomerResponseDto } from "../../services/model/Dto/Response/CustomerResponseDto";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  Pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  EmAndamento: { label: "Em Andamento", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  Concluido: { label: "Concluído", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  ConcluidoParcial: { label: "Concluído Parcial", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  FalhaTotal: { label: "Falha Total", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function EmailDispatchPage() {
  const [dispatches, setDispatches] = useState<EmailDispatchResponseDto[]>([]);
  const [configs, setConfigs] = useState<EmailConfigurationResponseDto[]>([]);
  const [customers, setCustomers] = useState<CustomerResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState<EmailDispatchRequestDto>({
    titulo: "",
    corpo: "",
    destinatarioIds: [],
    emailConfigurationId: undefined,
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [dispatchRes, configRes, customerRes] = await Promise.all([
        EmailDispatchService.getAll(1, 50),
        EmailConfigurationService.getAll(1, 50),
        getAllCustomersAsync(),
      ]);
      setDispatches(dispatchRes?.data ?? []);
      const ativas = (configRes?.data ?? []).filter((c) => c.ativo);
      setConfigs(ativas);
      setCustomers(customerRes ?? []);

      // Pré-selecionar config ativa padrão
      if (ativas.length > 0) {
        setForm((prev) => ({ ...prev, emailConfigurationId: ativas[0].id }));
      }
    } catch {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const toggleDestinatario = (id: string) => {
    setForm((prev) => {
      const exists = prev.destinatarioIds.includes(id);
      return {
        ...prev,
        destinatarioIds: exists
          ? prev.destinatarioIds.filter((d) => d !== id)
          : [...prev.destinatarioIds, id],
      };
    });
  };

  const selectAll = () => {
    const filtered = clientesFiltrados.map((c) => c.id).filter((id): id is string => !!id);
    setForm((prev) => ({ ...prev, destinatarioIds: filtered }));
  };

  const clearAll = () => {
    setForm((prev) => ({ ...prev, destinatarioIds: [] }));
  };

  const clientesFiltrados = customers.filter((c) => {
    if (!searchCliente) return true;
    const q = searchCliente.toLowerCase();
    return (
      c.nome?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.destinatarioIds.length === 0) {
      setError("Selecione pelo menos um destinatário.");
      return;
    }
    if (!form.titulo.trim() || !form.corpo.trim()) {
      setError("Preencha o assunto e o corpo do e-mail.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await EmailDispatchService.send(form);
      setSuccessMsg("Disparo iniciado com sucesso!");
      setShowForm(false);
      setForm({ titulo: "", corpo: "", destinatarioIds: [], emailConfigurationId: configs[0]?.id });
      await carregarDados();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao disparar e-mail.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <>
      <PageMeta
        title="Disparo de E-mail"
        description="Envie e-mails em massa para clientes cadastrados"
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Disparo de E-mail" />

        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
                <svg className="text-blue-600 size-6 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Disparo de E-mail</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Envie e-mails em massa para clientes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
              </svg>
              {showForm ? "Cancelar" : "Novo Disparo"}
            </button>
          </div>

          {/* Feedback */}
          {successMsg && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
              <button className="ml-2 font-bold" onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Formulário de disparo */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-blue-200 bg-blue-50/30 p-5 dark:border-blue-900/50 dark:bg-blue-900/10 space-y-5">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">Novo Disparo</h2>

              {/* Config SMTP */}
              <div>
                <label className={labelClass}>Conta de Envio (SMTP) *</label>
                {configs.length === 0 ? (
                  <p className="text-sm text-red-500">Nenhuma configuração SMTP ativa. Cadastre uma em E-mail → Configurações.</p>
                ) : (
                  <select
                    className={inputClass}
                    value={form.emailConfigurationId ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, emailConfigurationId: e.target.value }))}
                    required
                  >
                    {configs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nomeRemetente} &lt;{c.email}&gt; — {c.provedor}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Assunto */}
              <div>
                <label className={labelClass}>Assunto *</label>
                <input
                  className={inputClass}
                  required
                  placeholder="Ex: Novidades do Instituto Barros"
                  value={form.titulo}
                  onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                />
              </div>

              {/* Corpo */}
              <div>
                <label className={labelClass}>Corpo do E-mail *</label>
                <textarea
                  className={`${inputClass} min-h-[160px] resize-y`}
                  required
                  placeholder="Digite o conteúdo do e-mail aqui..."
                  value={form.corpo}
                  onChange={(e) => setForm((p) => ({ ...p, corpo: e.target.value }))}
                />
              </div>

              {/* Destinatários */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass + " mb-0"}>
                    Destinatários *{" "}
                    <span className="font-normal text-gray-400">
                      ({form.destinatarioIds.length} selecionado{form.destinatarioIds.length !== 1 ? "s" : ""})
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={selectAll} className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                      Selecionar todos
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button type="button" onClick={clearAll} className="text-xs text-gray-500 hover:underline dark:text-gray-400">
                      Limpar
                    </button>
                  </div>
                </div>

                {/* Busca */}
                <input
                  className={`${inputClass} mb-2`}
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchCliente}
                  onChange={(e) => setSearchCliente(e.target.value)}
                />

                {/* Lista scrollável */}
                <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  {clientesFiltrados.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">Nenhum cliente encontrado.</p>
                  ) : (
                    clientesFiltrados.map((c) => {
                      const selected = c.id ? form.destinatarioIds.includes(c.id) : false;
                      return (
                        <label
                          key={c.id ?? c.email}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/30 transition ${selected ? "bg-blue-50/60 dark:bg-blue-900/10" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => c.id && toggleDestinatario(c.id)}
                            className="size-4 rounded border-gray-300 text-blue-600"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{c.nome}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.email || "Sem e-mail"}</p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(null); }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sending || configs.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Disparando...
                    </>
                  ) : (
                    <>
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Disparar E-mail
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Histórico de disparos */}
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Histórico de Disparos</h2>
          {loading ? (
            <div className="text-center py-10 text-gray-400">Carregando...</div>
          ) : dispatches.length === 0 ? (
            <div className="text-center py-10 text-gray-400">Nenhum disparo realizado ainda.</div>
          ) : (
            <div className="space-y-3">
              {dispatches.map((d) => {
                const st = STATUS_LABEL[d.status] ?? { label: d.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <div
                    key={d.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-900/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{d.titulo}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Remetente: {d.nomeRemetente ?? "—"} ·{" "}
                          {d.dataDisparo ? new Date(d.dataDisparo).toLocaleString("pt-BR") : new Date(d.dataCadastro).toLocaleString("pt-BR")}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>Total: <strong className="text-gray-700 dark:text-gray-200">{d.totalDestinatarios}</strong></span>
                          <span>Enviados: <strong className="text-green-600 dark:text-green-400">{d.totalEnviados}</strong></span>
                          <span>Falhas: <strong className={d.totalFalhas > 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-200"}>{d.totalFalhas}</strong></span>
                        </div>
                        {d.mensagemErro && (
                          <p className="text-xs text-red-500 mt-1 dark:text-red-400">{d.mensagemErro}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
