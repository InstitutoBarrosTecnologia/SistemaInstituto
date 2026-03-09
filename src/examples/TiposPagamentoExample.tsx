import { useState } from 'react';
import { useTiposPagamento } from '../hooks/useTiposPagamento';
import PieChartGeneric from '../components/ecommerce/PieChartGeneric';
import { DashboardFilterRequestDto } from '../services/model/dashboard.types';

export default function TiposPagamentoExample() {
  const [filters, setFilters] = useState<DashboardFilterRequestDto>({
    periodo: 'mes',
    dataInicio: '2024-01-01',
    dataFim: '2024-12-31'
  });

  const { 
    data: tiposPagamentoData, 
    loading, 
    error, 
    refetch 
  } = useTiposPagamento(filters);

  const handlePeriodChange = (periodo: string) => {
    setFilters(prev => ({ ...prev, periodo }));
  };

  const handleDateChange = (field: 'dataInicio' | 'dataFim', value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleChartAction = (action: string) => {
    switch (action) {
      case "export":
        // Simular exportação dos dados
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

  // Função para gerar cores dinamicamente baseado na quantidade de tipos
  const generateColors = (count: number): string[] => {
    const baseColors = ["#3C50E0", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#EC4899", "#F97316"];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tipos de Pagamento - Consumo da API
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Exemplo de integração com o endpoint /Dashboard/tipos-pagamento
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

        {/* Gráfico e Dados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico */}
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
                title="Tipos de Pagamento"
                series={tiposPagamentoData.map(item => item.total)}
                labels={tiposPagamentoData.map(item => item.tipoPagamento)}
                loading={loading}
                tooltipSuffix="transações"
                colors={generateColors(tiposPagamentoData.length)}
                onDropdownAction={handleChartAction}
              />
            )}
          </div>

          {/* Tabela de Dados */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💳 Dados da API
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Carregando dados...</p>
              </div>
            ) : tiposPagamentoData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-900 dark:text-white font-medium">Tipo de Pagamento</th>
                      <th className="text-right py-2 text-gray-900 dark:text-white font-medium">Total</th>
                      <th className="text-right py-2 text-gray-900 dark:text-white font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiposPagamentoData.map((item, index) => {
                      const total = tiposPagamentoData.reduce((sum, tipo) => sum + tipo.total, 0);
                      const percentual = total > 0 ? (item.total / total) * 100 : 0;
                      
                      return (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-2 text-gray-700 dark:text-gray-300">{item.tipoPagamento}</td>
                          <td className="py-2 text-right text-gray-700 dark:text-gray-300">{item.total}</td>
                          <td className="py-2 text-right text-gray-700 dark:text-gray-300">{percentual.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {/* Total */}
                <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{tiposPagamentoData.reduce((sum, item) => sum + item.total, 0)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Nenhum dado encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">📊 Total de Tipos</h4>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {tiposPagamentoData.length}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">💰 Total de Transações</h4>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {tiposPagamentoData.reduce((sum, item) => sum + item.total, 0)}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">🏆 Tipo Mais Usado</h4>
            <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {tiposPagamentoData.length > 0 
                ? tiposPagamentoData.reduce((prev, current) => prev.total > current.total ? prev : current).tipoPagamento
                : "N/A"
              }
            </p>
          </div>
        </div>

        {/* Informações da API */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-4">
            🔗 Informações da API
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">Endpoint:</h4>
              <code className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded text-indigo-700 dark:text-indigo-300">
                GET /Dashboard/tipos-pagamento
              </code>
            </div>
            <div>
              <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">Parâmetros:</h4>
              <ul className="text-indigo-700 dark:text-indigo-300 space-y-1">
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
            {JSON.stringify(tiposPagamentoData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
