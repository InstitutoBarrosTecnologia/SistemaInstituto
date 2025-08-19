import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { MoreDotIcon } from "../../icons";

interface PieChartGenericProps {
  title: string;
  series: number[];
  labels: string[];
  loading?: boolean;
  colors?: string[];
  tooltipSuffix?: string;
  height?: number;
  showDropdown?: boolean;
  onDropdownAction?: (action: string) => void;
}

export default function PieChartGeneric({ 
  title,
  series,
  labels,
  loading = false,
  colors = ["#3C50E0", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#F97316", "#EC4899"],
  tooltipSuffix = "",
  height = 350,
  showDropdown = true,
  onDropdownAction
}: PieChartGenericProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const options: ApexOptions = {
    chart: {
      type: "pie",
      height: height,
      fontFamily: "Outfit, sans-serif",
    },
    labels: labels,
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        color: "#000000",
        opacity: 0.9,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      fontWeight: 400,
      labels: {
        colors: undefined,
        useSeriesColors: false,
      },
      markers: {
        size: 8,
        shape: "circle",
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "0%",
        },
        expandOnClick: false,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return val + (tooltipSuffix ? ` ${tooltipSuffix}` : "");
        },
      },
      style: {
        fontSize: "14px",
        fontFamily: "Outfit, sans-serif",
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#ffffff"],
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const hasData = series.length > 0 && series.some(value => value > 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {showDropdown && (
          <div className="relative">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={toggleDropdown}
            >
              <MoreDotIcon className="size-5" />
            </button>
            
            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                <button
                  onClick={() => {
                    onDropdownAction?.("export");
                    closeDropdown();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Exportar Dados
                </button>
                <button
                  onClick={() => {
                    onDropdownAction?.("details");
                    closeDropdown();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => {
                    onDropdownAction?.("refresh");
                    closeDropdown();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Atualizar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum dado encontrado
              </p>
            </div>
          </div>
        ) : (
          <Chart
            options={options}
            series={series}
            type="pie"
            height={height}
          />
        )}
      </div>
    </div>
  );
}

// Exportar tipo para uso externo
export type { PieChartGenericProps };
