import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { DashboardUnitDistributionResponse } from "../../services/model/dashboard.types";

interface UnidadesPieChartProps {
  data?: DashboardUnitDistributionResponse[];
  loading?: boolean;
}

export default function UnidadesPieChart({ data, loading = false }: UnidadesPieChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Usar apenas dados da API
  const chartData = data || [];
  
  const series = chartData.map(item => item.total);
  const labels = chartData.map(item => item.unidade);
  const options: ApexOptions = {
    chart: {
      type: "pie",
      height: 350,
      fontFamily: "Outfit, sans-serif",
    },
    labels: labels,
    colors: ["#3C50E0", "#06B6D4", "#F59E0B", "#EF4444"], // Azul, Ciano, Amarelo, Vermelho (cores originais ApexCharts)
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: "16px", // Aumentando um pouco o tamanho
        fontWeight: "bold",
        colors: ["#ffffff"], // Cor branca para as porcentagens
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        color: "#000000",
        opacity: 0.9, // Sombra preta bem forte para contraste
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit, sans-serif",
      fontSize: "14px",
      markers: {
        size: 4,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: "0%", // 0% para pie chart, 65% para donut chart
        },
      },
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        // Usar seriesIndex quando dataPointIndex for null
        const index = dataPointIndex !== null ? dataPointIndex : seriesIndex;
        
        const unidadeName = w.config.labels[index] || 
                           labels[index] || 
                           chartData[index]?.unidade || 
                           'Unidade não identificada';
        const totalValue = series[seriesIndex];
        
        return `
          <div style="
            padding: 10px 12px; 
            background-color: #070d18; 
            color: #ffffff; 
            border-radius: 6px; 
            font-size: 14px; 
            font-family: Outfit, sans-serif;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            border: 1px solid #1a1a1a;
          ">
            <div style="font-weight: 600; margin-bottom: 4px;">${unidadeName}</div>
            <div>${totalValue} sessões</div>
          </div>
        `;
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

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Distribuição por Unidades
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Percentual de sessões por unidade
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
              Ver Mais
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Exportar
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
              <div className="text-4xl mb-2">🏢</div>
              <p>Nenhum dado disponível</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
