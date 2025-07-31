interface UnidadePerformance {
  nome: string;
  percentual: number;
  cor: string;
  corFundo: string;
  corTexto: string;
}

interface PerformanceUnidadesProps {
  unidades?: UnidadePerformance[];
}

const defaultUnidades: UnidadePerformance[] = [
  {
    nome: "Marketplace",
    percentual: 35,
    cor: "bg-green-500",
    corFundo: "bg-green-50 dark:bg-green-900/20",
    corTexto: "text-green-600 dark:text-green-400"
  },
  {
    nome: "Ipiranga",
    percentual: 25,
    cor: "bg-blue-500",
    corFundo: "bg-blue-50 dark:bg-blue-900/20",
    corTexto: "text-blue-600 dark:text-blue-400"
  },
  {
    nome: "Mooca",
    percentual: 22,
    cor: "bg-yellow-500",
    corFundo: "bg-yellow-50 dark:bg-yellow-900/20",
    corTexto: "text-yellow-600 dark:text-yellow-400"
  },
  {
    nome: "Bela Vista",
    percentual: 18,
    cor: "bg-red-500",
    corFundo: "bg-red-50 dark:bg-red-900/20",
    corTexto: "text-red-600 dark:text-red-400"
  }
];

export default function PerformanceUnidades({ unidades = defaultUnidades }: PerformanceUnidadesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance das Unidades
      </h3>
      <div className="space-y-4">
        {unidades.map((unidade, index) => (
          <div key={index} className={`flex items-center justify-between p-3 ${unidade.corFundo} rounded-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${unidade.cor} rounded-full`}></div>
              <span className="font-medium text-gray-900 dark:text-white">
                {unidade.nome}
              </span>
            </div>
            <span className={`${unidade.corTexto} font-semibold`}>
              {unidade.percentual}%
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Insights
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• {unidades[0]?.nome} lidera com {unidades[0]?.percentual}% das sessões</li>
          <li>• {unidades[unidades.length - 1]?.nome} tem potencial de crescimento</li>
          <li>• Demais unidades mantêm performance estável</li>
        </ul>
      </div>
    </div>
  );
}
