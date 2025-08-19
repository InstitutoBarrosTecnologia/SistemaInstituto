import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { MoreDotIcon } from "../../icons";
import { DashboardPathologyResponseDto } from "../../services/model/Dto/Response/DashboardPathologyResponseDto";

interface PatologiasPieChartProps {
  data?: DashboardPathologyResponseDto[];
  loading?: boolean;
}

export default function PatologiasPieChart({ data, loading = false }: PatologiasPieChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  // Usar apenas dados da API
  const chartData = data || [];
  
  const series = chartData.map(item => item.quantidade);
  const labels = chartData.map(item => item.patologia);
  const options: ApexOptions = {
    chart: {
      type: "pie",
      height: 350,
      fontFamily: "Outfit, sans-serif",
    },
    labels: labels,
    colors: ["#3C50E0", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#F97316", "#EC4899"], // Cores variadas para patologias
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
          return val + " pacientes";
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          Distribuição de Patologias
        </h3>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          onClick={toggleDropdown}
        >
          <MoreDotIcon className="size-5" />
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex h-[350px] items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma patologia encontrada
              </p>
            </div>
          </div>
        ) : (
          <Chart
            options={options}
            series={series}
            type="pie"
            height={350}
          />
        )}
      </div>

      {!loading && chartData.length > 0 && (
        <div className="mt-6 space-y-3">
          {chartData.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: options.colors?.[index] || "#3C50E0" }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.patologia}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {item.quantidade} pacientes
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.percentual.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
          {chartData.length > 5 && (
            <div className="pt-2 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{chartData.length - 5} outras patologias
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
