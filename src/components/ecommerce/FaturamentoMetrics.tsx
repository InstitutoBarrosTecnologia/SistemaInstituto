import { DollarLineIcon, CalenderIcon } from "../../icons";
import { ReactNode } from "react";
import { DashboardFaturamentoResponseDto } from "../../services/model/dashboard.types";

interface FaturamentoMetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  loading?: boolean;
  color?: string;
}

interface FaturamentoMetricsProps {
  data?: DashboardFaturamentoResponseDto | null;
  loading?: boolean;
}

// Componente reutilizável para cada card de métrica de faturamento
function FaturamentoMetricCard({ 
  icon, 
  label, 
  value, 
  loading = false, 
  color = "text-gray-800 dark:text-white/90" 
}: FaturamentoMetricCardProps) {
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

export default function FaturamentoMetrics({ data, loading = false }: FaturamentoMetricsProps) {
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
      icon: <DollarLineIcon className="text-blue-600 size-6 dark:text-blue-400" />,
      label: "Faturamento Esperado",
      value: data ? formatCurrency(data.faturamentoEsperado) : "R$ 0,00",
      color: "text-blue-800 dark:text-blue-400"
    },
    {
      id: 2,
      icon: <DollarLineIcon className="text-green-600 size-6 dark:text-green-400" />,
      label: "Faturamento Real",
      value: data ? formatCurrency(data.faturamentoReal) : "R$ 0,00",
      color: "text-green-800 dark:text-green-400"
    },
    {
      id: 3,
      icon: <CalenderIcon className="text-purple-600 size-6 dark:text-purple-400" />,
      label: "Percentual Recebido",
      value: data ? formatPercentage(data.percentualRecebido) : "0%",
      color: "text-purple-800 dark:text-purple-400"
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Métricas de Faturamento
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {metrics.map((metric) => (
          <FaturamentoMetricCard
            key={metric.id}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            loading={loading}
            color={metric.color}
          />
        ))}
      </div>

      {/* Status do faturamento */}
      {data && !loading && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Status do Faturamento
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Meta de Recebimento:</span>
              <span className="font-medium text-gray-900 dark:text-white">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recebido Atual:</span>
              <span className={`font-medium ${
                data.percentualRecebido >= 85 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatPercentage(data.percentualRecebido)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Diferença:</span>
              <span className={`font-medium ${
                data.faturamentoReal >= data.faturamentoEsperado 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(data.faturamentoReal - data.faturamentoEsperado)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportar também os tipos para uso externo
export type { FaturamentoMetricsProps, FaturamentoMetricCardProps };
