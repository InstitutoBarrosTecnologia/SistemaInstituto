import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { MoreDotIcon } from "../../icons";

interface BarSeriesData {
  name: string;
  data: number[];
}

interface BarChartGenericProps {
  title: string;
  series: BarSeriesData[];
  categories: string[];
  loading?: boolean;
  colors?: string[];
  height?: number;
  showDropdown?: boolean;
  onDropdownAction?: (action: string) => void;
  tooltipFormatter?: (val: number, series?: string) => string;
  yAxisTitle?: string;
  columnWidth?: string;
  horizontal?: boolean;
}

export default function BarChartGeneric({
  title,
  series,
  categories,
  loading = false,
  colors = ["#3C50E0", "#06B6D4"],
  height = 350,
  showDropdown = true,
  onDropdownAction,
  tooltipFormatter = (val: number) => `${val}`,
  yAxisTitle,
  columnWidth = "39%",
  horizontal = false
}: BarChartGenericProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const options: ApexOptions = {
    colors: colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        columnWidth: columnWidth,
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
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
      show: series.length > 1,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: yAxisTitle,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      followCursor: true,
      intersect: false,
      shared: false,
      fixed: {
        enabled: false,
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const categoryName = w.config.xaxis.categories[dataPointIndex] || '';
        const seriesName = w.config.series[seriesIndex]?.name || '';
        const value = series[seriesIndex][dataPointIndex];
        const formattedValue = tooltipFormatter ? tooltipFormatter(value, seriesName) : `${value}`;
        
        return `
          <div style="
            padding: 10px 12px; 
            background-color: #070d18; 
            color: #ffffff; 
            border-radius: 6px; 
            font-size: 14px; 
            font-family: Outfit, sans-serif;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 999;
          ">
            ${seriesName ? `<div style="font-weight: 600; margin-bottom: 4px;">${seriesName}</div>` : ''}
            <div style="margin-bottom: 2px;">${categoryName}</div>
            <div style="font-weight: 500;">${formattedValue}</div>
          </div>
        `;
      },
      marker: {
        show: true,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: height * 0.8,
          },
          plotOptions: {
            bar: {
              columnWidth: "50%",
            },
          },
        },
      },
    ],
  };

  const hasData = series.length > 0 && series.some(s => s.data.length > 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {showDropdown && (
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
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

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
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
            <Chart options={options} series={series} type="bar" height={height} />
          )}
        </div>
      </div>
    </div>
  );
}

// Exportar tipos para uso externo
export type { BarChartGenericProps, BarSeriesData };
