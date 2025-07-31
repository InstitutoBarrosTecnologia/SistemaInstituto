import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { DashboardTopServicesResponse } from "../../services/model/dashboard.types";

interface ServicosPieChartProps {
  data?: DashboardTopServicesResponse[];
  loading?: boolean;
}

export default function ServicosPieChart({ data, loading = false }: ServicosPieChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Usar apenas dados da API
  const chartData = data || [];
  
  const series = chartData.map(item => item.total);
  const labels = chartData.map(item => item.servico);
  const options: ApexOptions = {
    chart: {
      type: "pie",
      height: 350,
      fontFamily: "Outfit, sans-serif",
    },
    labels: labels,
    colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4"], // Verde, Azul, Roxo, Amarelo, Vermelho, Ciano
    dataLabels: {
      enabled: true,
      formatter: function (_val: number, opts: any) {
        const seriesValue = opts.w.config.series[opts.seriesIndex];
        return seriesValue + " agend.";
      },
      style: {
        fontSize: "11px",
        fontWeight: "600",
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit, sans-serif",
      fontSize: "13px",
      markers: {
        size: 4,
      },
      itemMargin: {
        horizontal: 6,
        vertical: 2,
      },
      formatter: function(seriesName: string, opts: any) {
        const seriesValue = opts.w.config.series[opts.seriesIndex];
        return seriesName + ": " + seriesValue;
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: "0%", // 0% para pie chart
        },
      },
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " agendamentos no mês";
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
            fontSize: "11px",
          },
          dataLabels: {
            style: {
              fontSize: "9px",
            },
          },
        },
      },
    ],
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Calcular total de agendamentos
  const totalAgendamentos = series.reduce((total, agendamentos) => total + agendamentos, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Serviços Mais Agendados
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Total: {totalAgendamentos} agendamentos no mês
          </p>
        </div>
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
              Ver Ranking Completo
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Exportar Dados
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="flex justify-center">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Carregando dados...</span>
          </div>
        ) : chartData.length > 0 ? (
          <Chart options={options} series={series} type="pie" height={350} />
        ) : (
          <div className="flex items-center justify-center h-[350px] text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Nenhum dado disponível</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
