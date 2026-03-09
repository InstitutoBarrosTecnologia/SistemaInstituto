import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { PaperPlaneIcon } from "../../icons";

export default function Enviar() {
  const [formData, setFormData] = useState({
    titulo: "",
    mensagem: "",
    destinatarios: "todos", // todos, administradores, funcionarios, etc.
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio de notificação
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <PageMeta 
        title="Enviar Notificação" 
        description="Envie notificações para usuários do sistema"
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <PageBreadcrumb pageTitle="Enviar Notificação" />

        {/* Header Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
              <PaperPlaneIcon className="text-blue-600 size-6 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Enviar Notificação
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Envie notificações para usuários do sistema
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título da Notificação
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Digite o título da notificação"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Destinatários
              </label>
              <select
                name="destinatarios"
                value={formData.destinatarios}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
              >
                <option value="todos" className="dark:bg-gray-800 dark:text-white">Todos os usuários</option>
                <option value="administradores" className="dark:bg-gray-800 dark:text-white">Apenas Administradores</option>
                <option value="funcionarios" className="dark:bg-gray-800 dark:text-white">Funcionários</option>
                <option value="fisioterapeutas" className="dark:bg-gray-800 dark:text-white">Fisioterapeutas</option>
                <option value="comercial" className="dark:bg-gray-800 dark:text-white">Comercial</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mensagem
              </label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Digite a mensagem da notificação"
                rows={6}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:placeholder-gray-400 resize-none"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
              >
                <PaperPlaneIcon className="size-4" />
                Enviar Notificação
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ titulo: "", mensagem: "", destinatarios: "todos" })}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
