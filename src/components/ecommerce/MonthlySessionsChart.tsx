import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState } from "react";
import { DashboardMonthlyChartResponse, DashboardMonthlyMultiSeriesResponse } from "../../services/model/dashboard.types";

interface MonthlySessionsChartProps {
  data?: DashboardMonthlyChartResponse | DashboardMonthlyMultiSeriesResponse | null;
  loading?: boolean;
}

export default function MonthlySessionsChart({ data, loading = false }: MonthlySessionsChartProps) {
  // Função para verificar se é o modelo antigo (single series)
  const isSingleSeries = (data: any): data is DashboardMonthlyChartResponse => {
    return data && 'valores' in data;
  };

  // Usar apenas dados da API (sem fallback)
  const categories = data?.meses || [];
  
  // Determinar se é single ou multi series
  let chartSeries: { name: string; data: number[] }[];
  if (!data) {
    chartSeries = [];
  } else if (isSingleSeries(data)) {
    // Modelo antigo - uma única série
    chartSeries = data.valores && data.valores.length > 0 ? [
      {
        name: "Sessões",
        data: data.valores,
      }
    ] : [];
  } else {
    // Modelo novo - múltiplas séries
    chartSeries = data.series || [];
  }

  const options: ApexOptions = {
    colors: ["#98ff96", "#800000", "#e3651b"], // Verde para realizadas, vermelho para canceladas, laranja para reagendadas
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: "#6B7280", // cor do texto da legenda
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          colors: "#6B7280",
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: "#E5E7EB",
    },
    fill: {
      opacity: 0.9,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val} sessões`,
      },
    },
  };

  // Usar dados da API se disponíveis (apenas valores simples)
  const series = chartSeries;

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Sessões Mensais
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Exportar Dados
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Ver Detalhes
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {loading ? (
            <div className="flex items-center justify-center h-[180px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Carregando dados...</span>
            </div>
          ) : (
            <Chart options={options} series={series} type="bar" height={180} />
          )}
        </div>
      </div>
    </div>
  );
}
