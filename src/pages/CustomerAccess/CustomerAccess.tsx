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
  getCustomersWithoutAccessAsync,
  generateSingleAccessAsync,
  generateBatchAccessAsync,
  type CustomerAccessResponseDto
} from "../../services/customerAccess";
import { CustomerResponseDto } from "../../services/model/Dto/Response/CustomerResponseDto";
import { toast } from "react-toastify";

export default function CustomerAccessPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [customers, setCustomers] = useState<CustomerResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<CustomerAccessResponseDto | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Carregar clientes sem acesso
  useEffect(() => {
    loadCustomersWithoutAccess();
  }, []);

  const loadCustomersWithoutAccess = async () => {
    setLoading(true);
    try {
      const data = await getCustomersWithoutAccessAsync();
      setCustomers(data || []);
    } catch (error) {
      toast.error("Erro ao carregar clientes sem acesso");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      await loadCustomersWithoutAccess();
    } catch (error) {
      toast.error("Erro ao gerar acessos em lote");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateSingle = async (customerId: string) => {
    setProcessing(true);
    try {
      const result = await generateSingleAccessAsync({ customerId });
      
      if (result.success) {
        toast.success(`Acesso criado para ${result.customerName}`);
        await loadCustomersWithoutAccess();
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

  const toggleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c.id!));
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

  return (
    <>
      <PageMeta
        title="Instituto Barros - Gerar Acessos Clientes"
        description="Sistema para gerar acessos automáticos para clientes"
      />
      <PageBreadcrumb
        pageTitle="Gerar Acessos Clientes"
      />

      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-title-md2 font-bold text-black dark:text-white">
              Clientes sem Acesso ao Sistema
            </h4>
            <p className="mt-2 text-sm text-body">
              Total: {customers.length} clientes | Selecionados: {selectedCustomers.length}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadCustomersWithoutAccess}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-meta-5 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Carregando..." : "Atualizar"}
            </button>

            <button
              onClick={handleGenerateBatch}
              disabled={processing || customers.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {processing ? "Processando..." : 
                selectedCustomers.length > 0 
                  ? `Gerar ${selectedCustomers.length} Acessos`
                  : "Gerar Todos os Acessos"
              }
            </button>
          </div>
        </div>

        {/* Tabela de Clientes */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={toggleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Nome</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">CPF</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Email</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Data Nascimento</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    Carregando...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-body">
                    Nenhum cliente sem acesso encontrado
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-stroke dark:border-strokedark">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id!)}
                        onChange={() => toggleSelectCustomer(customer.id!)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 text-black dark:text-white">{customer.nome}</td>
                    <td className="px-4 py-4">{customer.cpf}</td>
                    <td className="px-4 py-4">{customer.email || "Não informado"}</td>
                    <td className="px-4 py-4">
                      {customer.dataNascimento 
                        ? new Date(customer.dataNascimento).toLocaleDateString('pt-BR')
                        : "Não informado"
                      }
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleGenerateSingle(customer.id!)}
                        disabled={processing}
                        className="inline-flex items-center justify-center rounded-md bg-success py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                      >
                        Gerar Acesso
                      </button>
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
            <li>Clientes estrangeiros (sem CPF válido) serão pulados automaticamente</li>
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
                  className="inline-flex items-center justify-center rounded-md bg-success py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Baixar CSV (Apenas Sucessos)
                </button>
                <button
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-md bg-meta-5 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
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
