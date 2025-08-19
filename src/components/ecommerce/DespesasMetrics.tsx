import { DollarLineIcon, CalenderIcon } from "../../icons";
import { ReactNode } from "react";
import { DashboardDespesasResponseDto } from "../../services/model/dashboard.types";

interface DespesasMetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  loading?: boolean;
  color?: string;
}

interface DespesasMetricsProps {
  data?: DashboardDespesasResponseDto | null;
  loading?: boolean;
}

// Componente reutilizável para cada card de métrica de despesas
function DespesasMetricCard({ 
  icon, 
  label, 
  value, 
  loading = false, 
  color = "text-gray-800 dark:text-white/90" 
}: DespesasMetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <div className="flex items-end justify-between mt-5 text-sm text-gray-500 dark:text-gray-400">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
        <span className={`text-lg font-bold ${color}`}>
          {loading ? "..." : value}
        </span>
      </div>
    </div>
  );
}

export default function DespesasMetrics({ data, loading = false }: DespesasMetricsProps) {
  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para formatar percentuais
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const metrics = [
    {
      id: 1,
      icon: <DollarLineIcon className="text-red-600 size-6 dark:text-red-400" />,
      label: "Total Despesas",
      value: data ? formatCurrency(data.totalDespesas) : "R$ 0,00",
      color: "text-red-800 dark:text-red-400"
    },
    {
      id: 2,
      icon: <DollarLineIcon className="text-green-600 size-6 dark:text-green-400" />,
      label: "Despesas Pagas",
      value: data ? formatCurrency(data.despesasPagas) : "R$ 0,00",
      color: "text-green-800 dark:text-green-400"
    },
    {
      id: 3,
      icon: <DollarLineIcon className="text-yellow-600 size-6 dark:text-yellow-400" />,
      label: "Despesas Pendentes",
      value: data ? formatCurrency(data.despesasPendentes) : "R$ 0,00",
      color: "text-yellow-800 dark:text-yellow-400"
    },
    {
      id: 4,
      icon: <CalenderIcon className="text-purple-600 size-6 dark:text-purple-400" />,
      label: "Percentual Pago",
      value: data ? formatPercentage(data.percentualPago) : "0%",
      color: "text-purple-800 dark:text-purple-400"
    }
  ];

  const additionalMetrics = [
    {
      id: 5,
      icon: <CalenderIcon className="text-blue-600 size-6 dark:text-blue-400" />,
      label: "Total Itens",
      value: data ? data.quantidadeDespesas.toString() : "0",
      color: "text-blue-800 dark:text-blue-400"
    },
    {
      id: 6,
      icon: <CalenderIcon className="text-green-600 size-6 dark:text-green-400" />,
      label: "Itens Pagos",
      value: data ? data.quantidadeDespesasPagas.toString() : "0",
      color: "text-green-800 dark:text-green-400"
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Métricas de Despesas
          {data?.periodo && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({data.periodo})
            </span>
          )}
        </h2>
        {data?.dataInicio && data?.dataFim && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Período: {new Date(data.dataInicio).toLocaleDateString('pt-BR')} - {new Date(data.dataFim).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
      
      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {metrics.map((metric) => (
          <DespesasMetricCard
            key={metric.id}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            loading={loading}
            color={metric.color}
          />
        ))}
      </div>

      {/* Métricas de quantidade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
        {additionalMetrics.map((metric) => (
          <DespesasMetricCard
            key={metric.id}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            loading={loading}
            color={metric.color}
          />
        ))}
      </div>

      {/* Status das despesas */}
      {data && !loading && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Status das Despesas
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Meta de Pagamento:</span>
              <span className="font-medium text-gray-900 dark:text-white">90%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Pago Atual:</span>
              <span className={`font-medium ${
                data.percentualPago >= 90 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatPercentage(data.percentualPago)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Itens Pendentes:</span>
              <span className={`font-medium ${
                (data.quantidadeDespesas - data.quantidadeDespesasPagas) === 0
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {data.quantidadeDespesas - data.quantidadeDespesasPagas}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Valor Pendente:</span>
              <span className={`font-medium ${
                data.despesasPendentes === 0
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(data.despesasPendentes)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportar também os tipos para uso externo
export type { DespesasMetricsProps, DespesasMetricCardProps };
