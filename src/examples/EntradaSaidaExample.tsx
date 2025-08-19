import { useState } from 'react';
import { useEntradaSaida } from '../hooks/useEntradaSaida';
import PieChartGeneric from '../components/ecommerce/PieChartGeneric';
import { DashboardFilterRequestDto } from '../services/model/dashboard.types';

export default function EntradaSaidaExample() {
  const [filters, setFilters] = useState<DashboardFilterRequestDto>({
    periodo: 'mes',
    dataInicio: '2024-01-01',
    dataFim: '2024-12-31'
  });

  const { 
    data: entradaSaidaData, 
    loading, 
    error, 
    refetch 
  } = useEntradaSaida(filters);

  const handlePeriodChange = (periodo: string) => {
    setFilters(prev => ({ ...prev, periodo }));
  };

  const handleDateChange = (field: 'dataInicio' | 'dataFim', value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleChartAction = (action: string) => {
    console.log(`Ação "${action}" executada no gráfico Entrada & Saída`);
    
    switch (action) {
      case "export":
        // Simular exportação dos dados
        const dataToExport = entradaSaidaData.map(item => ({
          Tipo: item.tipo,
          Quantidade: item.quantidade,
          Percentual: `${item.percentual.toFixed(1)}%`
        }));
        console.log('Dados para exportação:', dataToExport);
        alert('Dados exportados! Verifique o console.');
        break;
      case "details":
        alert('Navegando para detalhes...');
        break;
      case "refresh":
        refetch();
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Entrada & Saída - Consumo da API
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Exemplo de integração com o endpoint /Dashboard/entrada-saida
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🎛️ Filtros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <select
                value={filters.periodo || 'mes'}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="dia">Dia</option>
                <option value="semana">Semana</option>
                <option value="mes">Mês</option>
              </select>
            </div>

            {/* Data Início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={filters.dataInicio || ''}
                onChange={(e) => handleDateChange('dataInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Data Fim */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={filters.dataFim || ''}
                onChange={(e) => handleDateChange('dataFim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filial ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filial ID
              </label>
              <input
                type="text"
                placeholder="Ex: 123"
                value={filters.filialId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, filialId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  ❌ Erro ao carregar dados
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  🔄 Tentar Novamente
                </button>
              </div>
            ) : (
              <PieChartGeneric
                title="Entrada & Saída"
                series={entradaSaidaData.map(item => item.quantidade)}
                labels={entradaSaidaData.map(item => item.tipo)}
                loading={loading}
                tooltipSuffix="transações"
                colors={["#10B981", "#EF4444"]} // Verde para entrada, vermelho para saída
                onDropdownAction={handleChartAction}
              />
            )}
          </div>

          {/* Dados em Tabela */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Dados da API
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Carregando dados...</p>
              </div>
            ) : entradaSaidaData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-900 dark:text-white font-medium">Tipo</th>
                      <th className="text-right py-2 text-gray-900 dark:text-white font-medium">Quantidade</th>
                      <th className="text-right py-2 text-gray-900 dark:text-white font-medium">Percentual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entradaSaidaData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-2 text-gray-700 dark:text-gray-300">{item.tipo}</td>
                        <td className="py-2 text-right text-gray-700 dark:text-gray-300">{item.quantidade}</td>
                        <td className="py-2 text-right text-gray-700 dark:text-gray-300">{item.percentual.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Nenhum dado encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Informações da API */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
            🔗 Informações da API
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Endpoint:</h4>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                GET /Dashboard/entrada-saida
              </code>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Parâmetros:</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• periodo: {filters.periodo}</li>
                <li>• dataInicio: {filters.dataInicio || 'null'}</li>
                <li>• dataFim: {filters.dataFim || 'null'}</li>
                <li>• filialId: {filters.filialId || 'null'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            🔧 Debug - Resposta da API
          </h4>
          <pre className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-lg overflow-x-auto">
            {JSON.stringify(entradaSaidaData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
