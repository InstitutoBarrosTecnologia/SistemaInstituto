/**
 * CalendarFiltersPanel - Filter UI component
 * 
 * Displays filters for calendar:
 * - Filial (branch)
 * - Cliente (customer)
 * - Funcionario (employee/therapist)
 * - Status
 * 
 * Controlled by parent via hook
 */

import React from 'react';
import Select from '../form/Select';
import SelectWithSearch from '../form/SelectWithSearch';
import Label from '../form/Label';
import Badge from '../ui/badge/Badge';

interface FilterOption {
  label: string;
  value: string;
}

interface CalendarFiltersPanelProps {
  selectedFilial?: string;
  onFilialChange?: (value: string | undefined) => void;
  filialOptions: FilterOption[];

  selectedCliente?: string;
  onClienteChange?: (value: string | undefined) => void;
  clienteOptions: FilterOption[];

  selectedFuncionario?: string;
  onFuncionarioChange?: (value: string | undefined) => void;
  funcionarioOptions: FilterOption[];

  selectedStatus?: string;
  onStatusChange?: (value: string | undefined) => void;

  onClearFilters?: () => void;
  isLoading?: boolean;
}

export const CalendarFiltersPanel: React.FC<CalendarFiltersPanelProps> = ({
  selectedFilial,
  onFilialChange,
  filialOptions,
  selectedCliente,
  onClienteChange,
  clienteOptions,
  selectedFuncionario,
  onFuncionarioChange,
  funcionarioOptions,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  isLoading,
}) => {
  const activeFilters = [
    selectedFilial,
    selectedCliente,
    selectedFuncionario,
    selectedStatus,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Filtros</h3>
        {activeFilters > 0 && (
          <Badge
            variant="light"
            color="success"
            children={`${activeFilters} filtro${activeFilters > 1 ? 's' : ''}`}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filial Filter */}
        <div>
          <Label htmlFor="filter-filial">Filial</Label>
          <Select
            value={selectedFilial}
            onChange={(value) => onFilialChange?.(value || undefined)}
            options={[
              { label: 'Todas', value: '' },
              ...filialOptions,
            ]}
            disabled={isLoading}
          />
        </div>

        {/* Cliente Filter */}
        <div>
          <Label htmlFor="filter-cliente">Cliente</Label>
          <SelectWithSearch
            value={selectedCliente}
            onChange={(value) => onClienteChange?.(value || undefined)}
            options={[
              { label: 'Todos', value: '' },
              ...clienteOptions,
            ]}
            placeholder="Buscar cliente..."
            disabled={isLoading}
          />
        </div>

        {/* Funcionario Filter */}
        <div>
          <Label htmlFor="filter-funcionario">Funcionário</Label>
          <SelectWithSearch
            value={selectedFuncionario}
            onChange={(value) => onFuncionarioChange?.(value || undefined)}
            options={[
              { label: 'Todos', value: '' },
              ...funcionarioOptions,
            ]}
            placeholder="Buscar funcionário..."
            disabled={isLoading}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="filter-status">Status</Label>
          <Select
            value={selectedStatus}
            onChange={(value) => onStatusChange?.(value || undefined)}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Agendado', value: '0' },
              { label: 'Em andamento', value: '1' },
              { label: 'Concluído', value: '2' },
              { label: 'Cancelado', value: '3' },
            ]}
            disabled={isLoading}
          />
        </div>
      </div>

      {activeFilters > 0 && (
        <div className="mt-4">
          <button
            onClick={onClearFilters}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:text-gray-400"
          >
            Limpar filtros ({activeFilters})
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarFiltersPanel;
