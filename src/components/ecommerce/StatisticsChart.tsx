import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";

interface SeriesData {
  name: string;
  data: number[];
}

interface StatisticsChartProps {
  series?: SeriesData[];
  categories?: string[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export default function StatisticsChart({ 
  series = [], 
  categories = [],
  loading = false,
  error = null,
  onRefresh
}: StatisticsChartProps) {
  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
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
        const formattedValue = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
        
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
            <div style="font-weight: 600; margin-bottom: 4px;">${seriesName}</div>
            <div style="margin-bottom: 2px;">${categoryName}</div>
            <div style="font-weight: 500;">${formattedValue}</div>
          </div>
        `;
      },
      marker: {
        show: true,
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: categories.length > 0 ? categories : [
        "Jan",
        "Feb",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Comparação
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Comparação com o ano anterior
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm mb-2">Erro ao carregar dados de comparação</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="text-red-700 hover:text-red-800 text-sm underline"
            >
              Tentar novamente
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            {loading ? (
              <div className="flex items-center justify-center h-[310px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Chart options={options} series={series} type="area" height={310} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
