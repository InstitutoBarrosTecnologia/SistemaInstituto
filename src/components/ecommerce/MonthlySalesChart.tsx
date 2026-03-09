import BarChartGeneric from "./BarChartGeneric";

export default function MonthlySalesChart() {
  // Dados das séries
  const series = [
    {
      name: "Rec. Mensal",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
    {
      name: "Saída Mensal",
      data: [120, 250, 180, 220, 150, 165, 200, 90, 180, 320, 200, 100],
    },
  ];

  // Categorias dos meses
  const categories = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Cores diferenciadas para cada série
  const colors = ["#10B981", "#EF4444"]; // Verde para receita, vermelho para saída

  // Função para lidar com ações do dropdown
  const handleDropdownAction = (action: string) => {
    switch (action) {
      case "export":
        alert("Exportando dados do faturamento mensal");
        break;
      case "details":
        alert("Visualizando detalhes do faturamento mensal");
        break;
      case "refresh":
        alert("Atualizando dados do faturamento mensal");
        break;
      default:
        break;
    }
  };

  // Formatter personalizado para tooltip
  const tooltipFormatter = (val: number) => {
    return `R$ ${val.toLocaleString('pt-BR')}`;
  };

  return (
    <BarChartGeneric
      title="Faturamento Mensal"
      series={series}
      categories={categories}
      colors={colors}
      height={180}
      onDropdownAction={handleDropdownAction}
      tooltipFormatter={tooltipFormatter}
      yAxisTitle="Valor (R$)"
      columnWidth="39%"
    />
  );
}
