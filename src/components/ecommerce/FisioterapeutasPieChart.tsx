import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

export default function FisioterapeutasPieChart() {
  const [isOpen, setIsOpen] = useState(false);

  // Dados dos fisioterapeutas - sessões realizadas no mês
  const series = [89, 76, 65, 58, 42]; // Quantidade de sessões por fisioterapeuta
  const options: ApexOptions = {
    chart: {
      type: "pie",
      height: 350,
      fontFamily: "Outfit, sans-serif",
    },
    labels: ["Dr. Ana Silva", "Dr. Carlos Santos", "Dra. Maria Oliveira", "Dr. João Costa", "Dra. Lucia Ferreira"],
    colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"], // Verde, Azul, Roxo, Amarelo, Vermelho
    dataLabels: {
      enabled: true,
      formatter: function (_val: number, opts: any) {
        const seriesValue = opts.w.config.series[opts.seriesIndex];
        return seriesValue + " sessões";
      },
      style: {
        fontSize: "12px",
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
      fontSize: "14px",
      markers: {
        size: 4,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 3,
      },
      formatter: function(seriesName: string, opts: any) {
        const seriesValue = opts.w.config.series[opts.seriesIndex];
        return seriesName + ": " + seriesValue + " sessões";
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
          return val + " sessões realizadas";
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
          },
          dataLabels: {
            style: {
              fontSize: "10px",
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
  const totalSessoes = series.reduce((total, sessoes) => total + sessoes, 0);

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

      <div className="flex justify-center">
        <Chart options={options} series={series} type="pie" height={350} />
      </div>
    </div>
  );
}
