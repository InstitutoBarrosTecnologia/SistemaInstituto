import { CalenderIcon, DollarLineIcon } from "../../icons";
import { ReactNode } from "react";
import { useFaturamentoEDespesas } from "../../hooks/useFaturamentoEDespesas";
import { DashboardFilterRequestDto } from "../../services/model/dashboard.types";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  loading?: boolean;
  variation?: number;
}

interface MetricData {
  id: number;
  icon: ReactNode;
  label: string;
  value: string;
  loading?: boolean;
}

interface TransactionsMetricsProps {
  data?: MetricData[];
  loading?: boolean;
  filters?: DashboardFilterRequestDto;
}

// Componente reutilizável para cada card de métrica
function MetricCard({ icon, label, value, loading = false }: MetricCardProps) {
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
        <span className="text-lg font-bold text-gray-800 dark:text-white/90">
          {loading ? "..." : value}
        </span>
      </div>
    </div>
  );
}

export default function TransactionsMetrics({ 
  data, 
  loading: externalLoading = false, 
  filters = {} 
}: TransactionsMetricsProps) {
  
  // Hook para buscar dados de faturamento e despesas (período padrão)
  const { faturamento, despesas, loading: apiLoading } = useFaturamentoEDespesas(filters);
  
  // Hooks para dados por período específico
  const { 
    faturamento: faturamentoMensal, 
    despesas: despesasMensal, 
    loading: loadingMensal 
  } = useFaturamentoEDespesas({ ...filters, periodo: 'mes' });

  const { 
    faturamento: faturamentoSemanal, 
    despesas: despesasSemanal, 
    loading: loadingSemanal 
  } = useFaturamentoEDespesas({ ...filters, periodo: 'semana' });

  const { 
    faturamento: faturamentoDiario, 
    despesas: despesasDiario, 
    loading: loadingDiario 
  } = useFaturamentoEDespesas({ ...filters, periodo: 'dia' });
  
  // Função para formatar valores monetários
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Se dados externos são fornecidos, usa-os; caso contrário, usa dados da API
  if (data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
        {data.map((metric) => (
          <MetricCard
            key={metric.id}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            loading={externalLoading || metric.loading}
          />
        ))}
      </div>
    );
  }

  // Constrói métricas baseadas nos dados da API
  const apiMetrics: MetricData[] = [
    // Métricas principais (período padrão/geral)
    {
      id: 1,
      icon: <DollarLineIcon className="text-green-600 size-6 dark:text-green-400" />,
      label: "Faturamento Esperado",
      value: faturamento.data ? formatCurrency(faturamento.data.faturamentoEsperado) : "R$ 0,00",
      loading: apiLoading
    },
    {
      id: 2,
      icon: <DollarLineIcon className="text-green-600 size-6 dark:text-green-400" />,
      label: "Faturamento Real", 
      value: faturamento.data ? formatCurrency(faturamento.data.faturamentoReal) : "R$ 0,00",
      loading: apiLoading
    },
    {
      id: 3,
      icon: <DollarLineIcon className="text-blue-600 size-6 dark:text-blue-400" />,
      label: "% Recebido",
      value: faturamento.data ? `${faturamento.data.percentualRecebido.toFixed(1)}%` : "0%",
      loading: apiLoading
    },
    {
      id: 4,
      icon: <CalenderIcon className="text-red-600 size-6 dark:text-red-400" />,
      label: "Total Despesas",
      value: despesas.data ? formatCurrency(despesas.data.totalDespesas) : "R$ 0,00",
      loading: apiLoading
    },
    {
      id: 5,
      icon: <CalenderIcon className="text-green-600 size-6 dark:text-green-400" />,
      label: "Despesas Pagas",
      value: despesas.data ? formatCurrency(despesas.data.despesasPagas) : "R$ 0,00",
      loading: apiLoading
    },
    {
      id: 6,
      icon: <CalenderIcon className="text-orange-600 size-6 dark:text-orange-400" />,
      label: "Despesas Pendentes", 
      value: despesas.data ? formatCurrency(despesas.data.despesasPendentes) : "R$ 0,00",
      loading: apiLoading
    },
    
    // Faturamento por período
    {
      id: 7,
      icon: <DollarLineIcon className="text-blue-500 size-6 dark:text-blue-300" />,
      label: "Faturamento Mês",
      value: faturamentoMensal.data ? formatCurrency(faturamentoMensal.data.faturamentoReal) : "R$ 0,00",
      loading: loadingMensal
    },
    {
      id: 8,
      icon: <DollarLineIcon className="text-purple-500 size-6 dark:text-purple-300" />,
      label: "Faturamento Semana",
      value: faturamentoSemanal.data ? formatCurrency(faturamentoSemanal.data.faturamentoReal) : "R$ 0,00",
      loading: loadingSemanal
    },
    {
      id: 9,
      icon: <DollarLineIcon className="text-orange-500 size-6 dark:text-orange-300" />,
      label: "Faturamento Dia",
      value: faturamentoDiario.data ? formatCurrency(faturamentoDiario.data.faturamentoReal) : "R$ 0,00",
      loading: loadingDiario
    },
    
    // Despesas por período
    {
      id: 10,
      icon: <CalenderIcon className="text-blue-600 size-6 dark:text-blue-400" />,
      label: "Despesas Mês",
      value: despesasMensal.data ? formatCurrency(despesasMensal.data.totalDespesas) : "R$ 0,00",
      loading: loadingMensal
    },
    {
      id: 11,
      icon: <CalenderIcon className="text-purple-600 size-6 dark:text-purple-400" />,
      label: "Despesas Semana",
      value: despesasSemanal.data ? formatCurrency(despesasSemanal.data.totalDespesas) : "R$ 0,00",
      loading: loadingSemanal
    },
    {
      id: 12,
      icon: <CalenderIcon className="text-orange-600 size-6 dark:text-orange-400" />,
      label: "Despesas Dia",
      value: despesasDiario.data ? formatCurrency(despesasDiario.data.totalDespesas) : "R$ 0,00",
      loading: loadingDiario
    }
  ];

  const isLoading = apiLoading || externalLoading;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-6 mb-6">
      {apiMetrics.map((metric) => (
        <MetricCard
          key={metric.id}
          icon={metric.icon}
          label={metric.label}
          value={metric.value}
          loading={isLoading || metric.loading}
        />
      ))}
    </div>
  );
}

// Exportar também o tipo para uso externo
export type { MetricData, TransactionsMetricsProps };
