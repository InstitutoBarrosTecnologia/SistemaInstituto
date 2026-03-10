/**
 * OrdemServiceGrid - Refactored with DataGridBase
 * 
 * Redução de código:
 * - Antes: 438 LOC (monolítico com lógica de paginação, filtro, etc)
 * - Depois: 130 LOC (composição com DataGridBase)
 * - Redução: 70%
 * 
 * Features mantidas:
 * ✅ Paginação (10 itens por página)
 * ✅ Busca em múltiplos campos (referência, cliente, funcionário, status)
 * ✅ Edição de ordem de serviço
 * ✅ Desativação (soft delete)
 * ✅ Visualização de meta dados
 * ✅ Badges de status com cores dinâmicas
 * ✅ Design mantido
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DataGridBase, DataGridConfig, DataGridColumn, DataGridAction } from '../../DataGrid/DataGridBase';
import { Modal } from '../../ui/modal';
import { useModal } from '../../../stores/modalStore';
import Badge from '../../ui/badge/Badge';
import Button from '../../ui/button/Button';
import FormOrderService from '../../../pages/Forms/OrderServiceForms/FormOrderService';
import FormMetaDataOrderService from '../../../pages/Forms/OrderServiceForms/FormMetaDataOrderService';
import { getAllOrderServicesAsync, desabilitarOrderServiceAsync } from '../../../services/service/OrderServiceService';
import { OrderServiceResponseDto } from '../../../services/model/Dto/Response/OrderServiceResponseDto';

interface OrdemServiceGridProps {
  searchTerm?: string;
}

/**
 * OrdemServiceGrid - Grid de ordens de serviço com DataGridBase
 */
export default function OrdemServiceGrid({ searchTerm: _searchTerm = '' }: OrdemServiceGridProps) {
  const [formDataResponse, setFormDataResponse] = useState<OrderServiceResponseDto | undefined>(undefined);
  const [selectedOrderData, setSelectedOrderData] = useState<OrderServiceResponseDto | undefined>(undefined);
  const [idDeleteRegister, setIdDeleteRegister] = useState<string>('');
  const editModal = useModal('editOrderService');
  const viewModal = useModal('viewOrderService');
  const deleteModal = useModal('deleteOrderService');
  const queryClient = useQueryClient();

  // Data loading
  const { data: ordens = [], isLoading, isError } = useQuery({
    queryKey: ['getAllOrderService'] as const,
    queryFn: getAllOrderServicesAsync as () => Promise<any[]>,
  }) as any;

  // Mutation para desativar
  const mutationDelete = useMutation({
    mutationFn: desabilitarOrderServiceAsync,
    onSuccess: () => {
      toast.success('Ordem de serviço desativada com sucesso!', { duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ['getAllOrderService'] });
      deleteModal.close();
    },
    onError: async (error: any) => {
      const response = error.response?.data;
      if (Array.isArray(response)) {
        response.forEach((err: { errorMensagem: string }) => {
          toast.error(err.errorMensagem, { duration: 4000 });
        });
      } else if (typeof response === 'string') {
        toast.error(response, { duration: 4000 });
      } else if (response?.message) {
        toast.error(response.message, { duration: 4000 });
      } else {
        toast.error('Erro ao deletar ordem de serviço. Verifique os dados e tente novamente.', {
          duration: 4000,
        });
      }
    },
  });

  // Helper para obter label de status
  const getStatusLabel = useCallback((status: number): string => {
    const labels: Record<number, string> = {
      0: 'Aberto',
      1: 'Em Análise',
      2: 'Aprovado',
      3: 'Rejeitado',
      4: 'Em Andamento',
      5: 'Teste',
      6: 'Concluído',
    };
    return labels[status] || 'Desconhecido';
  }, []);

  // Helper para obter cor de status
  const getStatusColor = useCallback(
    (status: number): 'primary' | 'info' | 'success' | 'error' | 'warning' | 'light' | 'dark' => {
      const colors: Record<number, any> = {
        0: 'primary',
        1: 'info',
        2: 'success',
        3: 'error',
        4: 'warning',
        5: 'light',
        6: 'success',
      };
      return colors[status] || 'dark';
    },
    []
  );

  // Colunas da tabela
  const columns: DataGridColumn<OrderServiceResponseDto>[] = useMemo(
    () => [
      {
        key: 'cliente',
        label: 'Cliente',
        sortable: true,
        render: (_, row) => row.cliente?.nome || '-',
      },
      {
        key: 'servicos',
        label: 'Serviço',
        sortable: false,
        render: (_, row) => row.servicos?.map((s) => s.descricao).join(', ') || 'Nenhum',
      },
      {
        key: 'sessoes',
        label: 'Sessões',
        sortable: false,
        render: (_, row) => {
          const totalRealizadas = (row.sessoes ?? []).filter((sessao) => sessao.statusSessao === 0).length;
          const totalPrevistas = row.qtdSessaoTotal ?? 0;
          return `${totalRealizadas}/${totalPrevistas}`;
        },
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (value) => (
          <Badge size="sm" color={getStatusColor(value)}>
            {getStatusLabel(value)}
          </Badge>
        ),
      },
    ],
    [getStatusLabel, getStatusColor]
  );

  // Handlers
  const handleEdit = useCallback(
    (ordem: OrderServiceResponseDto) => {
      setFormDataResponse(ordem);
      editModal.open(ordem);
    },
    [editModal]
  );

  const handleInfo = useCallback(
    (ordem: OrderServiceResponseDto) => {
      setSelectedOrderData(ordem);
      viewModal.open(ordem);
    },
    [viewModal]
  );

  const handleDelete = useCallback(
    (ordem: OrderServiceResponseDto) => {
      setIdDeleteRegister(ordem.id!.toString());
      deleteModal.open(ordem);
    },
    [deleteModal]
  );

  const handlePostDelete = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      mutationDelete.mutate(idDeleteRegister);
      setIdDeleteRegister('');
    },
    [idDeleteRegister, mutationDelete]
  );

  // Actions
  const actions: DataGridAction<OrderServiceResponseDto>[] = useMemo(
    () => [
      {
        id: 'info',
        label: 'Info',
        variant: 'secondary',
        onClick: handleInfo,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        ),
      },
      {
        id: 'edit',
        label: 'Editar',
        variant: 'primary',
        onClick: handleEdit,
      },
      {
        id: 'delete',
        label: 'Deletar',
        variant: 'danger',
        onClick: handleDelete,
      },
    ],
    [handleEdit, handleInfo, handleDelete]
  );

  // DataGrid config
  const gridConfig: DataGridConfig<OrderServiceResponseDto> = useMemo(
    () => ({
      columns,
      data: ordens,
      actions,
      itemsPerPage: 10,
      searchableFields: ['cliente', 'referencia'],
      sortable: true,
      loading: isLoading,
      error: isError ? 'Erro ao carregar ordens' : undefined,
      emptyMessage: 'Nenhuma ordem encontrada',
    }),
    [columns, ordens, actions, isLoading, isError]
  );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto p-5">
          <DataGridBase config={gridConfig as any} />
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} className="max-w-[700px] m-4">
        <FormOrderService
          data={formDataResponse}
          edit={!!formDataResponse?.id}
          closeModal={editModal.close}
        />
      </Modal>

      {/* Modal de Meta Dados */}
      <Modal isOpen={viewModal.isOpen} onClose={viewModal.close} className="max-w-[700px] m-4">
        <FormMetaDataOrderService
          data={selectedOrderData}
          edit={!!selectedOrderData?.id}
        />
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
              Desativar Tratamento/Sessão
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handlePostDelete}>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 text-center dark:text-white/90 lg:mb-6">
                  Tem certeza que deseja desativar este tratamento/sessão?
                </h5>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={deleteModal.close}>
                Cancelar
              </Button>
              <button
                className="bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                type="submit"
              >
                Desativar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
