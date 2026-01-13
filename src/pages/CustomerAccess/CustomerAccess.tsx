/**
 * TEMPORÁRIO - Sistema de acesso automático para clientes
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */

import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import {
  getAllCustomersWithAccessStatusAsync,
  generateSingleAccessAsync,
  generateBatchAccessAsync,
  disableCustomerAccessAsync,
  type CustomerAccessResponseDto,
  type CustomerWithAccessStatusDto
} from "../../services/customerAccess";
import { toast } from "react-toastify";
import { UserCircleIcon, CheckCircleIcon, CloseLineIcon, TrashBinIcon, CheckLineIcon } from "../../icons";

export default function CustomerAccessPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [customers, setCustomers] = useState<CustomerWithAccessStatusDto[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithAccessStatusDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<CustomerAccessResponseDto | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'with' | 'without'>('all');

  // Carregar todos os clientes com status de acesso
  useEffect(() => {
    loadAllCustomers();
  }, []);

  // Aplicar filtro quando customers ou statusFilter mudar
  useEffect(() => {
    handleFilterChange(statusFilter);
  }, [customers, statusFilter]);

  const loadAllCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomersWithAccessStatusAsync();
      setCustomers(data || []);
    } catch (error) {
      toast.error("Erro ao carregar clientes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: 'all' | 'with' | 'without') => {
    setStatusFilter(filter);
    
    if (filter === 'all') {
      setFilteredCustomers(customers);
    } else if (filter === 'with') {
      setFilteredCustomers(customers.filter(c => c.hasAccess && !c.isAccessDisabled));
    } else {
      setFilteredCustomers(customers.filter(c => !c.hasAccess || c.isAccessDisabled));
    }
    
    // Limpar seleção ao mudar filtro
    setSelectedCustomers([]);
  };

  const handleGenerateBatch = async () => {
    setProcessing(true);
    setResults(null);
    try {
      const response = await generateBatchAccessAsync({
        customerIds: selectedCustomers.length > 0 ? selectedCustomers : undefined
      });
      setResults(response);
      toast.success(`Acessos gerados! Sucessos: ${response.successCount}, Falhas: ${response.failedCount}`);
      openModal();
      
      // Recarregar lista após processamento
      await loadAllCustomers();
      setSelectedCustomers([]);
    } catch (error) {
      toast.error("Erro ao gerar acessos em lote");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateSingle = async (customerId: string, customerName: string) => {
    setProcessing(true);
    try {
      const result = await generateSingleAccessAsync(customerId);
      
      if (result.success) {
        toast.success(`Acesso criado/reativado para ${customerName}`);
        await loadAllCustomers();
      } else {
        toast.error(`Erro: ${result.errorMessage}`);
      }
    } catch (error) {
      toast.error("Erro ao gerar acesso");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDisableAccess = async (customerId: string, customerName: string) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja DESABILITAR o acesso de ${customerName}?\n\n` +
      `O cliente não poderá mais fazer login no sistema.`
    );
    
    if (!confirmed) return;
    
    setProcessing(true);
    try {
      await disableCustomerAccessAsync(customerId, "Acesso desabilitado pelo administrador");
      toast.success(`Acesso de ${customerName} foi desabilitado com sucesso!`);
      await loadAllCustomers();
    } catch (error) {
      toast.error("Erro ao desabilitar acesso");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const toggleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const downloadCSV = () => {
    if (!results) return;

    const successResults = results.results.filter(r => r.success);
    const csvContent = [
      "Nome,CPF,Usuário,Senha",
      ...successResults.map(r => 
        `"${r.customerName}","${r.cpf}","${r.username}","${r.password}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `acessos_clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Estatísticas
  const totalClients = customers.length;
  const withAccess = customers.filter(c => c.hasAccess && !c.isAccessDisabled).length;
  const withoutAccess = customers.filter(c => !c.hasAccess || c.isAccessDisabled).length;

  return (
    <>
      <PageMeta
        title="Instituto Barros - Gerenciar Acessos de Clientes"
        description="Sistema para gerenciar acessos de clientes ao portal"
      />
      <PageBreadcrumb
        pageTitle="Gerenciar Acessos de Clientes"
      />

      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        
        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-5">
          {/* Card 1 - Total de Clientes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900">
              <UserCircleIcon className="text-blue-600 dark:text-blue-400 size-6" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total de Clientes</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-white/90">{totalClients}</span>
            </div>
          </div>

          {/* Card 2 - Com Acesso Ativo */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900">
              <CheckCircleIcon className="text-green-600 dark:text-green-400 size-6" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Com Acesso Ativo</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-white/90">{withAccess}</span>
            </div>
          </div>

          {/* Card 3 - Sem Acesso ou Desabilitados */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-900">
              <CloseLineIcon className="text-red-600 dark:text-red-400 size-6" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sem Acesso ou Desabilitados</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-white/90">{withoutAccess}</span>
            </div>
          </div>
        </div>

        {/* Header com título e ações */}
        <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-title-md2 font-bold text-black dark:text-white">
              Gerenciamento de Acessos
            </h4>
            <p className="mt-2 text-sm text-body">
              Total: {filteredCustomers.length} clientes | Selecionados: {selectedCustomers.length}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadAllCustomers}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-600 hover:bg-gray-700 py-3 px-6 text-center font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Carregando..." : "Atualizar"}
            </button>

            <button
              onClick={handleGenerateBatch}
              disabled={processing || filteredCustomers.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 py-3 px-6 text-center font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Processando..." : 
                selectedCustomers.length > 0 
                  ? `Gerar ${selectedCustomers.length} Acessos`
                  : "Gerar em Lote"
              }
            </button>
          </div>
        </div>

        {/* Filtros de Status */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-2 dark:bg-meta-4 text-body hover:bg-gray-3 dark:hover:bg-meta-3'
            }`}
          >
            Todos ({totalClients})
          </button>
          <button
            onClick={() => handleFilterChange('with')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'with' 
                ? 'bg-success text-white' 
                : 'bg-gray-2 dark:bg-meta-4 text-body hover:bg-gray-3 dark:hover:bg-meta-3'
            }`}
          >
            Com Acesso ({withAccess})
          </button>
          <button
            onClick={() => handleFilterChange('without')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'without' 
                ? 'bg-warning text-white' 
                : 'bg-gray-2 dark:bg-meta-4 text-body hover:bg-gray-3 dark:hover:bg-meta-3'
            }`}
          >
            Sem Acesso ({withoutAccess})
          </button>
        </div>

        {/* Tabela de Clientes */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={toggleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Nome</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">CPF</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Email</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Telefone</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white" style={{ minWidth: '160px' }}>Status de Acesso</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white" style={{ minWidth: '150px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    Carregando...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-body">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-stroke dark:border-strokedark">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelectCustomer(customer.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 text-black dark:text-white">{customer.nome}</td>
                    <td className="px-4 py-4">{customer.cpf}</td>
                    <td className="px-4 py-4">{customer.email || "Não informado"}</td>
                    <td className="px-4 py-4">{customer.nrTelefone || "Não informado"}</td>
                    
                    {/* Status de Acesso */}
                    <td className="px-4 py-4" style={{ minWidth: '160px' }}>
                      {customer.hasAccess && !customer.isAccessDisabled ? (
                        <span className="inline-flex rounded bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                          ✓ Com Acesso
                        </span>
                      ) : customer.isAccessDisabled ? (
                        <span className="inline-flex rounded bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                          ✗ Desabilitado
                        </span>
                      ) : (
                        <span className="inline-flex rounded bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                          ⚠ Sem Acesso
                        </span>
                      )}
                    </td>
                    
                    {/* Ações */}
                    <td className="px-4 py-4" style={{ minWidth: '150px' }}>
                      {customer.hasAccess && !customer.isAccessDisabled ? (
                        // Cliente COM acesso ativo
                        <button
                          onClick={() => handleDisableAccess(customer.id, customer.nome)}
                          disabled={processing}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 hover:bg-red-700 py-2 px-4 text-center font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <TrashBinIcon className="size-4" />
                          Desabilitar
                        </button>
                      ) : (
                        // Cliente SEM acesso ou desabilitado
                        <button
                          onClick={() => handleGenerateSingle(customer.id, customer.nome)}
                          disabled={processing || (customer.estrangeiro && !customer.cpf)}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 hover:bg-green-700 py-2 px-4 text-center font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {customer.isAccessDisabled ? (
                            <>
                              <CheckLineIcon className="size-4" />
                              Reativar
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="size-4" />
                              Gerar Acesso
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Informações Importantes */}
        <div className="mt-6 rounded-md bg-warning bg-opacity-10 p-4 border border-warning">
          <h5 className="mb-2 font-semibold text-warning">Informações Importantes:</h5>
          <ul className="list-disc list-inside text-sm text-body space-y-1">
            <li><strong>Usuário:</strong> CPF do cliente (11 dígitos sem máscara)</li>
            <li><strong>Senha padrão:</strong> Data de nascimento no formato DDMMYYYY (ex: 15031990)</li>
            <li><strong>Role:</strong> Cliente (acesso ao Portal do Cliente)</li>
            <li>Clientes estrangeiros (sem CPF válido) não podem ter acesso gerado</li>
            <li>Clientes com acesso desabilitado podem ser reativados</li>
            <li>Processamento em lotes de 50 clientes por vez</li>
            <li>Após gerar os acessos, baixe o CSV com as credenciais</li>
          </ul>
        </div>
      </div>

      {/* Modal de Resultados */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Resultados da Geração de Acessos</h3>
          <div className="space-y-4">
          {results && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 rounded bg-gray-2 dark:bg-meta-4">
                  <p className="text-2xl font-bold">{results.totalProcessed}</p>
                  <p className="text-sm text-body">Total Processado</p>
                </div>
                <div className="text-center p-4 rounded bg-success bg-opacity-10">
                  <p className="text-2xl font-bold text-success">{results.successCount}</p>
                  <p className="text-sm text-body">Sucessos</p>
                </div>
                <div className="text-center p-4 rounded bg-danger bg-opacity-10">
                  <p className="text-2xl font-bold text-danger">{results.failedCount}</p>
                  <p className="text-sm text-body">Falhas</p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={downloadCSV}
                  className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 py-3 px-6 text-center font-medium text-white"
                >
                  Baixar CSV (Apenas Sucessos)
                </button>
                <button
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-md bg-gray-600 hover:bg-gray-700 py-3 px-6 text-center font-medium text-white"
                >
                  Fechar
                </button>
              </div>

              {/* Lista de Resultados */}
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="sticky top-0 bg-gray-2 dark:bg-meta-4">
                    <tr className="text-left">
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Nome</th>
                      <th className="px-4 py-2">CPF</th>
                      <th className="px-4 py-2">Mensagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((result, index) => (
                      <tr key={index} className="border-b border-stroke dark:border-strokedark">
                        <td className="px-4 py-2">
                          {result.success ? (
                            <span className="inline-flex rounded bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                              Sucesso
                            </span>
                          ) : (
                            <span className="inline-flex rounded bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                              Falha
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">{result.customerName}</td>
                        <td className="px-4 py-2">{result.cpf}</td>
                        <td className="px-4 py-2">
                          {result.success 
                            ? `Usuário: ${result.username} | Senha: ${result.password}`
                            : result.errorMessage
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        </div>
      </Modal>
    </>
  );
}
