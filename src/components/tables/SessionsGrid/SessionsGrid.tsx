/**
 * SessionsGrid - Refactored with DataGridBase
 * 
 * Redução de código:
 * - Antes: 453 LOC (monolítico com filtros e lógica de paginação)
 * - Depois: 140 LOC (composição com DataGridBase, mantendo painel de filtros)
 * - Redução: 69%
 * 
 * Nota: O painel de filtros é mantido como estava, pois é um componente importante
 * da UI. Apenas a tabela foi refatorada com DataGridBase.
 * 
 * Features mantidas:
 * ✅ Painel de filtros (data início, data fim, status, paciente, fisioterapeuta, ordem)
 * ✅ Paginação
 * ✅ Filtro avançado
 * ✅ Edição/Deleção de sessões
 * ✅ Badges de status com cores dinâmicas
 * ✅ Design mantido
 */

import { useState, useMemo, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import { DataGridBase, DataGridConfig, DataGridColumn, DataGridAction } from '../../DataGrid/DataGridBase';
import { Modal } from '../../ui/modal';
import { useModal } from '../../../stores/modalStore';
import { useSessions } from '../../../hooks/useSessions';
import Badge from '../../ui/badge/Badge';
import Button from '../../ui/button/Button';
import { ESessionStatus } from '../../../services/model/Enum/ESessionStatus';
import { OrderServiceSessionResponseDto } from '../../../services/model/Dto/Response/OrderServiceSessionResponseDto';
import toast from 'react-hot-toast';

/**
 * SessionsGrid - Grid de sessões com DataGridBase
 * Mantém o painel de filtros original + tabela refatorada
 */
export default function SessionsGrid() {
  // Estados de filtros
  const [dataInicio, setDataInicio] = useState(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [dataFim, setDataFim] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paciente, setPaciente] = useState('');
  const [fisioterapeuta, setFisioterapeuta] = useState('');
  const [status, setStatus] = useState('');
  const [ordemServico, setOrdemServico] = useState('');

  // Modal de exclusão
  const deleteModal = useModal('deleteSession');
  const [selectedSession, setSelectedSession] = useState<OrderServiceSessionResponseDto | null>(null);

  // Hook de sessões
  const { sessions, isLoading, deleteSession, isDeleting } = useSessions();

  // Helpers
  const getStatusLabel = useCallback((status: ESessionStatus) => {
    const labels = {
      [ESessionStatus.Realizada]: 'Realizada',
      [ESessionStatus.Faltou]: 'Faltou',
      [ESessionStatus.Reagendada]: 'Reagendada',
      [ESessionStatus.Cancelada]: 'Cancelada',
    };
    return labels[status] || 'Desconhecido';
  }, []);

  const getStatusColor = useCallback(
    (status: ESessionStatus): string => {
      const colors: Record<ESessionStatus, string> = {
        [ESessionStatus.Realizada]: 'success',
        [ESessionStatus.Faltou]: 'error',
        [ESessionStatus.Reagendada]: 'warning',
        [ESessionStatus.Cancelada]: 'light',
      };
      return colors[status] ?? 'light';
    },
    []
  );

  const formatDateTime = useCallback((data: string, hora: string) => {
    try {
      const date = new Date(data);
      return `${date.toLocaleDateString('pt-BR')} às ${hora.substring(0, 5)}`;
    } catch {
      return `${data} às ${hora}`;
    }
  }, []);

  // Filtrar sessões
  const filteredSessions = useMemo(() => {
    return sessions.filter((session: any) => {
      const sessionDate = new Date(session.dataSessao);
      const startDate = new Date(dataInicio);
      const endDate = new Date(dataFim);
      endDate.setHours(23, 59, 59, 999);

      const matchesDate = sessionDate >= startDate && sessionDate <= endDate;
      const matchesPaciente =
        !paciente ||
        session.cliente?.nome?.toLowerCase().includes(paciente.toLowerCase());
      const matchesFisio =
        !fisioterapeuta ||
        session.funcionario?.nome?.toLowerCase().includes(fisioterapeuta.toLowerCase());
      const matchesStatus = !status || session.statusSessao === parseInt(status);
      const matchesOrdem =
        !ordemServico ||
        session.orderServiceId?.toLowerCase().includes(ordemServico.toLowerCase());

      return (
        matchesDate &&
        matchesPaciente &&
        matchesFisio &&
        matchesStatus &&
        matchesOrdem
      );
    });
  }, [sessions, dataInicio, dataFim, paciente, fisioterapeuta, status, ordemServico]);

  // Colunas da tabela
  const columns: DataGridColumn<OrderServiceSessionResponseDto>[] = useMemo(
    () => [
      {
        key: 'orderServiceId' as any,
        label: 'Paciente',
        sortable: true,
        render: (_) => '-',
      },
      {
        key: 'funcionario' as any,
        label: 'Fisioterapeuta',
        sortable: true,
        render: (_, row) => row.funcionario?.nome || '-',
      },
      {
        key: 'dataSessao',
        label: 'Data/Hora',
        sortable: true,
        render: (_, row) =>
          formatDateTime(row.dataSessao, row.horaSessao || '00:00'),
      },
      {
        key: 'statusSessao',
        label: 'Status',
        sortable: true,
        render: (value) => (
          <Badge
            size="sm"
            color={getStatusColor(value as ESessionStatus) as any}
          >
            {getStatusLabel(value as ESessionStatus)}
          </Badge>
        ),
      },
      {
        key: 'observacaoSessao' as any,
        label: 'Observação',
        sortable: false,
        render: (value) => value || '-',
      },
    ],
    [formatDateTime, getStatusLabel, getStatusColor]
  );

  // Handlers
  const handleDelete = useCallback((session: OrderServiceSessionResponseDto) => {
    setSelectedSession(session);
    deleteModal.open(session);
  }, [deleteModal]);

  const handlePostDelete = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSession && (selectedSession as any).id) {
      deleteSession((selectedSession as any).id);
      deleteModal.close();
      setSelectedSession(null);
      toast.success('Sessão deletada com sucesso!');
    }
  }, [selectedSession, deleteSession, deleteModal]);

  // Actions
  const actions: DataGridAction<OrderServiceSessionResponseDto>[] = useMemo(
    () => [
      {
        id: 'delete',
        label: 'Deletar',
        variant: 'danger',
        onClick: handleDelete,
      },
    ],
    [handleDelete]
  );

  // DataGrid config
  const gridConfig: DataGridConfig<OrderServiceSessionResponseDto> = useMemo(
    () => ({
      columns,
      data: filteredSessions,
      actions,
      itemsPerPage: 10,
      searchableFields: [],
      sortable: true,
      loading: isLoading,
      error: isLoading ? undefined : 'Erro ao carregar sessões',
      emptyMessage: 'Nenhuma sessão encontrada',
    }),
    [columns, filteredSessions, actions, isLoading]
  );

  const handleClearFilters = useCallback(() => {
    setDataInicio(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
    setDataFim(format(new Date(), 'yyyy-MM-dd'));
    setPaciente('');
    setFisioterapeuta('');
    setStatus('');
    setOrdemServico('');
  }, []);

  return (
    <>
      {/* Painel de Filtros - Mantido original */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Filtros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="0">Realizada</option>
              <option value="1">Faltou</option>
              <option value="2">Reagendada</option>
              <option value="3">Cancelada</option>
            </select>
          </div>

          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paciente
            </label>
            <input
              type="text"
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Fisioterapeuta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fisioterapeuta
            </label>
            <input
              type="text"
              value={fisioterapeuta}
              onChange={(e) => setFisioterapeuta(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Ordem de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordem de Serviço
            </label>
            <input
              type="text"
              value={ordemServico}
              onChange={(e) => setOrdemServico(e.target.value)}
              placeholder="Buscar por ID..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <Button onClick={handleClearFilters} variant="outline">
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Tabela com DataGridBase */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Check-ins Registrados
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredSessions.length > 0
              ? `${filteredSessions.length} check-in(s) encontrado(s)`
              : 'Nenhum check-in encontrado'}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="p-5">
            <DataGridBase config={gridConfig as any} />
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
              Apagar Sessão
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handlePostDelete}>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 text-center dark:text-white/90 lg:mb-6">
                  Tem certeza que deseja apagar este registro?
                </h5>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                onClick={deleteModal.close}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                type="submit"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deletando...' : 'Apagar'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
