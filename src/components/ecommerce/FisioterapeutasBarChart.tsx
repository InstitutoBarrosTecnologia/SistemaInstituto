import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { DashboardPhysiotherapistSessionsResponse } from "../../services/model/dashboard.types";

interface FisioterapeutasBarChartProps {
  data?: DashboardPhysiotherapistSessionsResponse[];
  loading?: boolean;
}

export default function FisioterapeutasBarChart({
  data,
  loading = false,
}: FisioterapeutasBarChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Usar apenas dados da API
  const chartData = data || [];

  const series = [
    {
      name: "Sessões Realizadas",
      data: chartData.map((item) => item.total),
    },
  ];

  const categories = chartData.map((item) => item.fisioterapeuta);

  const options: ApexOptions = {
    colors: ["#98ff96"], // Verde para as barras
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "600",
        colors: ["#fff"],
      },
      offsetY: -5,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: "400",
        },
        rotate: -45,
        rotateAlways: true,
        maxHeight: 80,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Sessões",
        style: {
          fontSize: "14px",
          fontWeight: "600",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 3,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " sessões realizadas";
        },
      },
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "70%",
            },
          },
          xaxis: {
            labels: {
              rotate: -90,
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

  // Calcular total de sessões
  const totalSessoes = series[0].data.reduce(
    (total, sessoes) => total + sessoes,
    0
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Sessões por Fisioterapeuta
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Total: {totalSessoes} sessões realizadas no mês
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
              Ver Detalhes
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Exportar Relatório
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mb-4">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Carregando dados...</span>
          </div>
        ) : chartData.length > 0 ? (
          <Chart options={options} series={series} type="bar" height={350} />
        ) : (
          <div className="flex items-center justify-center h-[350px] text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
