import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EmailConfigurationService from "../../services/service/EmailConfigurationService";
import {
  EmailConfigurationResponseDto,
  EmailConfigurationRequestDto,
} from "../../services/model/email.types";

const PROVEDORES = ["Hostinger", "Gmail", "Outlook", "SendGrid", "Amazon SES", "Outro"];

const emptyForm = (): EmailConfigurationRequestDto => ({
  nomeRemetente: "",
  email: "",
  senha: "",
  descricao: "",
  smtpHost: "",
  smtpPorta: 587,
  protocolo: "TLS",
  provedor: "Hostinger",
  ativo: true,
});

export default function EmailConfigurationPage() {
  const [configs, setConfigs] = useState<EmailConfigurationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EmailConfigurationRequestDto>(emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const carregarConfigs = async () => {
    try {
      setLoading(true);
      const result = await EmailConfigurationService.getAll(1, 50);
      setConfigs(result?.data ?? []);
    } catch {
      setError("Erro ao carregar configurações de e-mail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConfigs();
  }, []);

  const handleEdit = (config: EmailConfigurationResponseDto) => {
    setEditingId(config.id);
    setForm({
      nomeRemetente: config.nomeRemetente,
      email: config.email,
      senha: "", // senha não retorna do backend
      descricao: config.descricao ?? "",
      smtpHost: config.smtpHost,
      smtpPorta: config.smtpPorta,
      protocolo: config.protocolo as "TLS" | "SSL",
      provedor: config.provedor,
      ativo: config.ativo,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await EmailConfigurationService.update(editingId, form);
        setSuccessMsg("Configuração atualizada com sucesso!");
      } else {
        await EmailConfigurationService.create(form);
        setSuccessMsg("Configuração criada com sucesso!");
      }
      setShowForm(false);
      setEditingId(null);
      await carregarConfigs();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar configuração.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta configuração de e-mail?")) return;
    try {
      await EmailConfigurationService.delete(id);
      setSuccessMsg("Configuração excluída.");
      await carregarConfigs();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setError("Erro ao excluir configuração.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400";

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <>
      <PageMeta
        title="Configurações de E-mail"
        description="Gerencie as contas SMTP para disparo de e-mails"
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Configurações de E-mail" />

        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
                <svg className="text-blue-600 size-6 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  Configurações de E-mail
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contas SMTP para envio de e-mails
                </p>
              </div>
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Configuração
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
            </div>
          )}

          {/* Formulário */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-blue-200 bg-blue-50/30 p-5 dark:border-blue-900/50 dark:bg-blue-900/10">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
                {editingId ? "Editar Configuração" : "Nova Configuração"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nome do Remetente *</label>
                  <input
                    className={inputClass}
                    required
                    placeholder="Ex: Instituto Barros"
                    value={form.nomeRemetente}
                    onChange={e => setForm(p => ({ ...p, nomeRemetente: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>E-mail Remetente *</label>
                  <input
                    type="email"
                    className={inputClass}
                    required
                    placeholder="contato@institutabarros.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Senha / App Password {editingId ? "(deixe em branco para manter)" : "*"}
                  </label>
                  <input
                    type="password"
                    className={inputClass}
                    required={!editingId}
                    placeholder="••••••••"
                    value={form.senha}
                    onChange={e => setForm(p => ({ ...p, senha: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Provedor *</label>
                  <select
                    className={inputClass}
                    required
                    value={form.provedor}
                    onChange={e => setForm(p => ({ ...p, provedor: e.target.value }))}
                  >
                    {PROVEDORES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Host SMTP *</label>
                  <input
                    className={inputClass}
                    required
                    placeholder="smtp.hostinger.com"
                    value={form.smtpHost}
                    onChange={e => setForm(p => ({ ...p, smtpHost: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Porta SMTP *</label>
                  <input
                    type="number"
                    className={inputClass}
                    required
                    min={1}
                    max={65535}
                    value={form.smtpPorta}
                    onChange={e => setForm(p => ({ ...p, smtpPorta: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Protocolo *</label>
                  <select
                    className={inputClass}
                    value={form.protocolo}
                    onChange={e => setForm(p => ({ ...p, protocolo: e.target.value as "TLS" | "SSL" }))}
                  >
                    <option value="TLS">TLS (porta 587)</option>
                    <option value="SSL">SSL (porta 465)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="ativo-config"
                    checked={form.ativo}
                    onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <label htmlFor="ativo-config" className="text-sm text-gray-700 dark:text-gray-300">
                    Configuração ativa (padrão para novos disparos)
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Descrição</label>
                  <input
                    className={inputClass}
                    placeholder="Ex: Conta principal Hostinger"
                    value={form.descricao ?? ""}
                    onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {saving ? "Salvando..." : editingId ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          )}

          {/* Lista */}
          {loading ? (
            <div className="text-center py-10 text-gray-400">Carregando...</div>
          ) : configs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Nenhuma configuração cadastrada. Clique em "Nova Configuração" para começar.
            </div>
          ) : (
            <div className="space-y-3">
              {configs.map(cfg => (
                <div
                  key={cfg.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-900/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      <svg className="size-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">
                        {cfg.nomeRemetente}
                        {cfg.ativo && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Ativo
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cfg.email} · {cfg.smtpHost}:{cfg.smtpPorta} ({cfg.protocolo}) · {cfg.provedor}
                      </p>
                      {cfg.descricao && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{cfg.descricao}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cfg)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cfg.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
