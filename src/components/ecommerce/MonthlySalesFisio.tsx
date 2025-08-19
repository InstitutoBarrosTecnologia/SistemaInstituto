import BarChartGeneric from "./BarChartGeneric";

export default function MonthlySalesFisio() {
  // Dados das séries (apenas uma série para fisioterapia)
  const series = [
    {
      name: "Sessões Fisio",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  // Categorias dos meses
  const categories = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Cor específica para fisioterapia
  const colors = ["#06B6D4"]; // Azul ciano para fisioterapia

  // Função para lidar com ações do dropdown
  const handleDropdownAction = (action: string) => {
    switch (action) {
      case "export":
        console.log("Exportando dados do faturamento fisio...");
        alert("Exportando dados do faturamento fisio");
        break;
      case "details":
        console.log("Visualizando detalhes do faturamento fisio...");
        alert("Visualizando detalhes do faturamento fisio");
        break;
      case "refresh":
        console.log("Atualizando dados do faturamento fisio...");
        alert("Atualizando dados do faturamento fisio");
        break;
      default:
        break;
    }
  };

  // Formatter personalizado para tooltip
  const tooltipFormatter = (val: number) => {
    return `${val} sessões`;
  };

  return (
    <BarChartGeneric
      title="Faturamento Fisio"
      series={series}
      categories={categories}
      colors={colors}
      height={180}
      onDropdownAction={handleDropdownAction}
      tooltipFormatter={tooltipFormatter}
      yAxisTitle="Sessões"
      columnWidth="39%"
    />
  );
}
