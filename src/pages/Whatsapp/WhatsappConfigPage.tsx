import { useState, useEffect, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import {
  getWhatsappNumbers,
  createWhatsappNumber,
  updateWhatsappNumber,
  toggleWhatsappNumber,
} from "../../services/WhatsappService";
import type {
  WhatsappNumberResponseDto,
  WhatsappNumberRequestDto,
} from "../../services/model/WhatsappTypes";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Badge from "../../components/ui/badge/Badge";

const POLLING_INTERVAL_MS = 60_000;

const emptyForm: WhatsappNumberRequestDto = {
  nomeInstancia: "",
  numero: "",
  filialId: "",
  ativo: true,
  tokenInstancia: "",
};

export default function WhatsappConfigPage() {
  const [numbers, setNumbers] = useState<WhatsappNumberResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WhatsappNumberRequestDto>(emptyForm);

  const fetchNumbers = useCallback(async () => {
    try {
      const data = await getWhatsappNumbers();
      setNumbers(data);
    } catch {
      // silencia erros de polling
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNumbers();
    const interval = setInterval(fetchNumbers, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNumbers]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    openModal();
  };

  const handleOpenEdit = (number: WhatsappNumberResponseDto) => {
    setEditingId(number.id);
    setForm({
      id: number.id,
      nomeInstancia: number.nomeInstancia,
      numero: number.numero,
      filialId: number.filialId,
      ativo: number.ativo,
      tokenInstancia: "", // não exibimos o token atual por segurança
    });
    setError(null);
    openModal();
  };

  const handleSave = async () => {
    if (!form.nomeInstancia || !form.numero || !form.filialId) {
      setError("Preencha Nome da Instância, Número e Filial.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        await updateWhatsappNumber(editingId, form);
      } else {
        await createWhatsappNumber(form);
      }
      await fetchNumbers();
      closeModal();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleWhatsappNumber(id);
      await fetchNumbers();
    } catch {
      // silencia
    }
  };

  const connectedColor = (n: WhatsappNumberResponseDto) =>
    n.conectado ? "success" : "error";

  const connectedLabel = (n: WhatsappNumberResponseDto) =>
    n.conectado ? "Conectado" : "Desconectado";

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        Carregando...
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Instituto Barros - WhatsApp Config"
        description="Gerenciamento de números WhatsApp"
      />
      <PageBreadcrumb pageTitle="WhatsApp - Config" />
      <div className="space-y-6">
        <ComponentCard title="Números WhatsApp">
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              + Novo Número
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase border-b dark:border-white/10">
                <tr>
                  <th className="px-4 py-3">Nome Instância</th>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3">Conexão</th>
                  <th className="px-4 py-3">Última Conexão</th>
                  <th className="px-4 py-3">Ativo</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {numbers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                      Nenhum número cadastrado.
                    </td>
                  </tr>
                ) : (
                  numbers.map((n) => (
                    <tr key={n.id}>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                        {n.nomeInstancia}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{n.numero}</td>
                      <td className="px-4 py-3">
                        <Badge size="sm" color={connectedColor(n)}>
                          {connectedLabel(n)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {n.ultimaConexao
                          ? new Date(n.ultimaConexao).toLocaleString("pt-BR")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge size="sm" color={n.ativo ? "success" : "light"}>
                          {n.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(n)}
                            className="px-3 py-1 text-xs border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggle(n.id)}
                            className={`px-3 py-1 text-xs border rounded-md ${
                              n.ativo
                                ? "border-red-300 text-red-600 hover:bg-red-50"
                                : "border-green-300 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {n.ativo ? "Desativar" : "Ativar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>

      {/* Modal de criação / edição */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
            {editingId ? "Editar Número" : "Novo Número"}
          </h4>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Instância *
              </label>
              <input
                type="text"
                value={form.nomeInstancia}
                onChange={(e) => setForm((f) => ({ ...f, nomeInstancia: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5"
                placeholder="ex: instituto-barros-sp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número (DDI+DDD+Número) *
              </label>
              <input
                type="text"
                value={form.numero}
                onChange={(e) => setForm((f) => ({ ...f, numero: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5"
                placeholder="ex: 5511999999999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ID da Filial *
              </label>
              <input
                type="text"
                value={form.filialId}
                onChange={(e) => setForm((f) => ({ ...f, filialId: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5"
                placeholder="UUID da filial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Token da Instância {editingId ? "(deixe em branco para manter)" : "*"}
              </label>
              <input
                type="password"
                value={form.tokenInstancia ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, tokenInstancia: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5"
                placeholder="Token da Evolution API"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={form.ativo}
                onChange={(e) => setForm((f) => ({ ...f, ativo: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="ativo" className="text-sm text-gray-700 dark:text-gray-300">
                Ativo
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
