import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  CalenderIcon,
  TaskIcon,
} from "../../icons";
import Badge from "../../components/ui/badge/Badge";
import MonthlySessionsChart from "../../components/ecommerce/MonthlySessionsChart";
import UnidadesPieChart from "../../components/ecommerce/UnidadesPieChart";
import FisioterapeutasBarChart from "../../components/ecommerce/FisioterapeutasBarChart";
import ServicosPieChart from "../../components/ecommerce/ServicosPieChart";
import PatologiasPieChart from "../../components/ecommerce/PatologiasPieChart";
import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardOperacao() {
  const {
    pacientesAtivos,
    agendamentosMes,
    agendamentosSemana,
    agendamentosDia,
    avaliacoesAgendadasMes,
    avaliacoesAgendadasSemana,
    avaliacoesAgendadasDia,
    avaliacoesExecutadas,
    sessoesMes,
    sessoesSemana,
    sessoesDia,
    sessoesCanceladas,
    sessoesMensaisMulti,
    unidadesDistribuicao,
    servicosMaisAgendados,
    sessoesPorFisioterapeuta,
    patologiasAgrupadas,
    loading,
    error,
    isLoading,
    recarregarDados,
  } = useDashboard();

  // Função para renderizar badge com variação
  const renderVariacaoBadge = (variacao: number) => {
    const isPositive = variacao >= 0;
    const color = isPositive ? "success" : "error";
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

    return (
      <Badge color={color}>
        <Icon />
        {Math.abs(variacao).toFixed(1)}%
      </Badge>
    );
  };

  if (error) {
    return (
      <>
        <PageMeta
          title="Instituto Barros - Sistema"
          description="Sistema Instituto Barros - Página para gerenciamento de Operação"
        />
        <PageBreadcrumb pageTitle="Dashboard de Operação" />

        <div className="container mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">
              Erro ao carregar dados
            </h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={recarregarDados}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <PageMeta
        title="Instituto Barros - Sistema"
        description="Sistema Instituto Barros - Página para gerenciamento de Operação"
      />
      <PageBreadcrumb pageTitle="Dashboard de Operação" />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard de Operação
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Acompanhe as métricas operacionais e indicadores de desempenho
          </p>
          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Carregando dados...</span>
            </div>
          )}
        </div>

        {/* Primeira linha de indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {/* Pacientes Ativos */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Pacientes Ativos
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.pacientesAtivos
                    ? "..."
                    : pacientesAtivos?.total || 0}
                </h4>
              </div>
              {pacientesAtivos && renderVariacaoBadge(pacientesAtivos.variacao)}
            </div>
          </div>
          {/* Agendamentos Marcados Mês */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Agendamentos Marcados Mês
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.agendamentos ? "..." : agendamentosMes?.total || 0}
                </h4>
              </div>
              {agendamentosMes && renderVariacaoBadge(agendamentosMes.variacao)}
            </div>
          </div>

          {/* Agendamentos Marcados Semana */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Agendamentos Marcados Semana
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.agendamentos
                    ? "..."
                    : agendamentosSemana?.total || 0}
                </h4>
              </div>
              {agendamentosSemana &&
                renderVariacaoBadge(agendamentosSemana.variacao)}
            </div>
          </div>

          {/* Agendamentos Marcados Dia */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Agendamentos Marcados Dia
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.agendamentos ? "..." : agendamentosDia?.total || 0}
                </h4>
              </div>
              {agendamentosDia && renderVariacaoBadge(agendamentosDia.variacao)}
            </div>
          </div>

          {/* Avaliações Agendadas Mês */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avaliações Agendadas Mês
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.avaliacoes
                    ? "..."
                    : avaliacoesAgendadasMes?.total || 0}
                </h4>
              </div>
              {avaliacoesAgendadasMes &&
                renderVariacaoBadge(avaliacoesAgendadasMes.variacao)}
            </div>
          </div>

          {/* Avaliações Agendadas Semana */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avaliações Agendadas Semana
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.avaliacoes
                    ? "..."
                    : avaliacoesAgendadasSemana?.total || 0}
                </h4>
              </div>
              {avaliacoesAgendadasSemana &&
                renderVariacaoBadge(avaliacoesAgendadasSemana.variacao)}
            </div>
          </div>

          {/* Avaliações Agendadas Dia */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avaliações Agendadas Dia
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.avaliacoes
                    ? "..."
                    : avaliacoesAgendadasDia?.total || 0}
                </h4>
              </div>
              {avaliacoesAgendadasDia &&
                renderVariacaoBadge(avaliacoesAgendadasDia.variacao)}
            </div>
          </div>

          {/* Avaliações Executadas */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <TaskIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avaliações Executadas
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.avaliacoes
                    ? "..."
                    : avaliacoesExecutadas?.total || 0}
                </h4>
              </div>
              {avaliacoesExecutadas &&
                renderVariacaoBadge(avaliacoesExecutadas.variacao)}
            </div>
          </div>
        </div>

        {/* Segunda linha de indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Sessões do Mês */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sessões do Mês
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.sessoes ? "..." : sessoesMes?.total || 0}
                </h4>
              </div>
              {sessoesMes && renderVariacaoBadge(sessoesMes.variacao)}
            </div>
          </div>

          {/* Sessões da Semana */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <TaskIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sessões da Semana
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.sessoes ? "..." : sessoesSemana?.total || 0}
                </h4>
              </div>
              {sessoesSemana && renderVariacaoBadge(sessoesSemana.variacao)}
            </div>
          </div>
          {/* Sessões Diárias */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sessões Diárias
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.sessoes ? "..." : sessoesDia?.total || 0}
                </h4>
              </div>
              {sessoesDia && renderVariacaoBadge(sessoesDia.variacao)}
            </div>
          </div>
          {/* Sessões Canceladas */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sessões Canceladas Dia
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading.sessoes
                    ? "..."
                    : sessoesCanceladas?.total
                    ? `${sessoesCanceladas.total}`
                    : "0"}
                </h4>
              </div>
              {sessoesCanceladas &&
                renderVariacaoBadge(sessoesCanceladas.variacao)}
            </div>
          </div>
        </div>
        {/* Gráfico de Sessões Mensais */}
        <div className="mb-8">
          <MonthlySessionsChart
            data={sessoesMensaisMulti}
            loading={loading.graficos}
          />
        </div>
        {/* Gráficos de Pizza - Unidades, Serviços e Patologias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div>
            <UnidadesPieChart
              data={unidadesDistribuicao}
              loading={loading.graficos}
            />
          </div>
          <div>
            <ServicosPieChart
              data={servicosMaisAgendados}
              loading={loading.graficos}
            />
          </div>
          <div>
            <PatologiasPieChart
              data={patologiasAgrupadas}
              loading={loading.graficos}
            />
          </div>
        </div>

        {/* Gráfico de Fisioterapeutas */}
        <div className="mb-8">
          <FisioterapeutasBarChart
            data={sessoesPorFisioterapeuta}
            loading={loading.graficos}
          />
        </div>
      </div>
    </>
  );
}
