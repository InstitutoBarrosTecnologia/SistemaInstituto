import React, { useState, useEffect } from "react";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import TransactionsMetrics from "../../components/ecommerce/TransactionsMetrics";
import PieChartGeneric from "../../components/ecommerce/PieChartGeneric";
import BarChartGeneric from "../../components/ecommerce/BarChartGeneric";
import { useEntradaSaida } from "../../hooks/useEntradaSaida";
import { useTiposPagamento } from "../../hooks/useTiposPagamento";
import { useTransacoesPorUnidade } from "../../hooks/useTransacoesPorUnidade";
import { useFaturamentoMensal } from "../../hooks/useFaturamentoMensal";
import { useFaturamentoComparativo } from "../../hooks/useFaturamentoComparativo";
import { useFaturamentoPorCategoriaServico } from "../../hooks/useFaturamentoPorCategoriaServico";

export default function Home() {
  // Estado de loading
  const [loading, setLoading] = useState({
    graficos: true,
  });

  // Hook para dados de entrada e saída da API
  const {
    data: entradaSaidaData,
    loading: loadingEntradaSaida,
    error: errorEntradaSaida,
    refetch: refetchEntradaSaida,
  } = useEntradaSaida({ periodo: "mes" });

  // Hook para dados de tipos de pagamento da API
  const {
    data: tiposPagamentoData,
    loading: loadingTiposPagamento,
    error: errorTiposPagamento,
    refetch: refetchTiposPagamento,
  } = useTiposPagamento({ periodo: "mes" });

  // Hook para dados de transações por unidade da API
  const {
    data: unidadeTransacaoData,
    loading: loadingUnidadeTransacao,
    error: errorUnidadeTransacao,
    refetch: refetchUnidadeTransacao,
  } = useTransacoesPorUnidade({ periodo: "mes" });

  // Hook para dados de faturamento mensal da API
  const {
    data: faturamentoMensalData,
    loading: loadingFaturamentoMensal,
    error: errorFaturamentoMensal,
    refetch: refetchFaturamentoMensal,
  } = useFaturamentoMensal(new Date().getFullYear());

  // Hook para dados de faturamento por categoria de serviço
  const {
    data: faturamentoCategoriaData,
    loading: loadingCategoria,
    error: errorCategoria,
    refetch: refetchCategoria,
  } = useFaturamentoPorCategoriaServico({ periodo: "mes" });

  // Hook para dados de faturamento comparativo da API
  const {
    data: faturamentoComparativoData,
    loading: loadingFaturamentoComparativo,
    error: errorFaturamentoComparativo,
    refetch: refetchFaturamentoComparativo,
  } = useFaturamentoComparativo();

  // Função para atualizar dados de entrada e saída
  const handleRefreshEntradaSaida = () => {
    refetchEntradaSaida();
  };

  // Função para atualizar dados de tipos de pagamento
  const handleRefreshTiposPagamento = () => {
    refetchTiposPagamento();
  };

  // Função para atualizar dados de transações por unidade
  const handleRefreshUnidadeTransacao = () => {
    refetchUnidadeTransacao();
  };

  // Função para atualizar dados de faturamento mensal
  const handleRefreshFaturamentoMensal = () => {
    refetchFaturamentoMensal();
  };

  // Função para atualizar dados de faturamento por categoria
  const handleChartCategoriaAction = () => {
    refetchCategoria();
  };

  // Processamento dos dados de faturamento mensal para o gráfico
  const processedFaturamentoMensal = React.useMemo(() => {
    if (!faturamentoMensalData || faturamentoMensalData.length === 0) {
      return {
        series: [],
        categories: [],
      };
    }

    const sortedData = [...faturamentoMensalData].sort((a, b) => a.mes - b.mes);

    return {
      series: [
        {
          name: "Faturamento",
          data: sortedData.map((item) => item.totalReceita),
        },
      ],
      categories: sortedData.map((item) => item.nomeMes),
    };
  }, [faturamentoMensalData]);

  // Simular carregamento dos dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading((prev) => ({
        ...prev,
        graficos: false,
      }));
    }, 2000); // 2 segundos de loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageMeta
        title="Sistema Instituto Barros"
        description="Dashboard do Sistema Instituto Barros"
      />
      <TransactionsMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div>
          {errorEntradaSaida ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Erro ao carregar Entrada & Saída
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {errorEntradaSaida}
              </p>
              <button
                onClick={handleRefreshEntradaSaida}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <PieChartGeneric
              title="Entrada & Saída"
              series={entradaSaidaData?.map((item) => item.quantidade) || []}
              labels={entradaSaidaData?.map((item) => item.tipo) || []}
              loading={loading.graficos || loadingEntradaSaida}
              tooltipSuffix="transações"
              colors={["#EF4444", "#10B981"]}
              onDropdownAction={handleRefreshEntradaSaida}
            />
          )}
        </div>
        <div>
          {errorCategoria ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                ❌ Erro ao carregar faturamento por categoria
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {errorCategoria}
              </p>
              <button
                onClick={refetchCategoria}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                🔄 Tentar Novamente
              </button>
            </div>
          ) : (
            <PieChartGeneric
              title="Faturamento por Categoria"
              series={faturamentoCategoriaData.map((item) => item.valorReceita)}
              labels={faturamentoCategoriaData.map((item) => item.tipo)}
              loading={loadingCategoria}
              tooltipSuffix=""
              colors={[
                "#3B82F6",
                "#8B5CF6",
                "#F59E0B",
                "#EF4444",
                "#10B981",
                "#F97316",
              ]} // Cores variadas para categorias
              onDropdownAction={handleChartCategoriaAction}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div>
          {errorTiposPagamento ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm mb-2">
                Erro ao carregar tipos de transação
              </p>
              <button
                onClick={handleRefreshTiposPagamento}
                className="text-red-700 hover:text-red-800 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <PieChartGeneric
              title="Tipos de Transação"
              series={tiposPagamentoData.map((item) => item.total)}
              labels={tiposPagamentoData.map((item) => item.tipoPagamento)}
              loading={loading.graficos || loadingTiposPagamento}
              tooltipSuffix="transações"
              colors={[
                "#3C50E0",
                "#06B6D4",
                "#F59E0B",
                "#EF4444",
                "#10B981",
                "#8B5CF6",
              ]}
              onDropdownAction={handleRefreshTiposPagamento}
            />
          )}
        </div>
        <div>
          {errorUnidadeTransacao ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm mb-2">
                Erro ao carregar dados de unidade
              </p>
              <button
                onClick={handleRefreshUnidadeTransacao}
                className="text-red-700 hover:text-red-800 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <PieChartGeneric
              title="Distribuição por Unidade"
              series={unidadeTransacaoData?.map((item) => item.total) || []}
              labels={unidadeTransacaoData?.map((item) => item.servico) || []}
              loading={loadingUnidadeTransacao}
              tooltipSuffix="transações"
              colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
              onDropdownAction={handleRefreshUnidadeTransacao}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-1 mb-8">
        <div>
          {errorFaturamentoMensal ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm mb-2">
                Erro ao carregar dados de faturamento mensal
              </p>
              <button
                onClick={handleRefreshFaturamentoMensal}
                className="text-red-700 hover:text-red-800 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <BarChartGeneric
              title="Faturamento Mensal"
              series={processedFaturamentoMensal.series}
              categories={processedFaturamentoMensal.categories}
              colors={["#10B981"]} // Verde para receita
              height={180}
              loading={loadingFaturamentoMensal}
              tooltipFormatter={(val) => `R$ ${val.toLocaleString("pt-BR")}`}
              yAxisTitle="Valor (R$)"
              columnWidth="39%"
              onDropdownAction={handleRefreshFaturamentoMensal}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-1 mb-8">
        <StatisticsChart
          series={faturamentoComparativoData?.series || []}
          categories={faturamentoComparativoData?.categories || []}
          loading={loadingFaturamentoComparativo}
          error={errorFaturamentoComparativo}
          onRefresh={refetchFaturamentoComparativo}
        />
      </div>
    </>
  );
}
