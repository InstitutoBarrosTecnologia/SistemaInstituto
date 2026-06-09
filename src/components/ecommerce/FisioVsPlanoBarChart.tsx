import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface FisioVsPlanoBarChartProps {
  data?: Record<string, Record<string, number>>;
  loading?: boolean;
}

export default function FisioVsPlanoBarChart({
  data,
  loading = false,
}: FisioVsPlanoBarChartProps) {
  const fisioData = data?.["Fisio"] ?? {};
  const planoData = data?.["Plano"] ?? {};

  // Unifica e ordena os meses presentes em ambas as séries
  const allMonths = Array.from(
    new Set([...Object.keys(fisioData), ...Object.keys(planoData)])
  ).sort((a, b) => {
    const [ma, ya] = a.split("/").map(Number);
    const [mb, yb] = b.split("/").map(Number);
    return ya !== yb ? ya - yb : ma - mb;
  });

  const series = [
    {
      name: "Check-ins Fisio (produtividade)",
      data: allMonths.map((m) => fisioData[m] ?? 0),
    },
    {
      name: "Baixas Plano (consumo paciente)",
      data: allMonths.map((m) => planoData[m] ?? 0),
    },
  ];

  const options: ApexOptions = {
    colors: ["#3C50E0", "#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: allMonths,
      labels: {
        style: { fontSize: "12px", colors: "#6B7280" },
      },
    },
    yaxis: {
      min: 0,
      tickAmount: 5,
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (val) => Math.round(val).toString(),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
      fontSize: "13px",
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} sessão(ões)`,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Comparativo Fisio vs Plano
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!allMonths.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Comparativo Fisio vs Plano
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Sem dados no período</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Comparativo Fisio vs Plano
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Check-ins do fisioterapeuta (produtividade) vs baixas administrativas (consumo do plano do paciente)
        </p>
      </div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
