import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

export default function UnidadesDonutChart() {
  const [isOpen, setIsOpen] = useState(false);

  // Dados das unidades
  const series = [35, 25, 22, 18]; // Percentuais de cada unidade
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 350,
      fontFamily: "Outfit, sans-serif",
    },
    labels: ["Marketplace", "Ipiranga", "Mooca", "Bela Vista"],
    colors: ["#98ff96", "#50d2ff", "#e3651b", "#800000"], // Verde, Azul, Laranja, Vermelho
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: "14px",
        fontWeight: "600",
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
          size: "65%", // 65% para donut chart
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              offsetY: 10,
              formatter: function (val: string) {
                return val + "%";
              },
            },
            total: {
              show: true,
              showAlways: false,
              label: "Total",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => {
                  return a + b;
                }, 0) + "%";
              },
            },
          },
        },
      },
    },
    stroke: {
      width: 3,
      colors: ["#fff"],
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + "%";
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
            Percentual de sessões por unidade (Donut)
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
        <Chart options={options} series={series} type="donut" height={350} />
      </div>
    </div>
  );
}
