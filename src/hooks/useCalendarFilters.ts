/**
 * useCalendarFilters - Custom hook for calendar filter management
 * 
 * Handles:
 * - Filter state (filial, cliente, funcionario)
 * - Options loading for selects
 * - Filter application
 * - Role-based filtering
 */

import { useEffect, useState, useCallback } from 'react';
import { BranchOfficeService } from '../services/service/BranchOfficeService';
import EmployeeService from '../services/service/EmployeeService';
import { getAllCustomersAsync } from '../services/service/CustomerService';
import {
  getUserRoleFromToken,
  getUserFuncionarioIdFromToken,
  shouldApplyAgendaFilter,
} from '../services/util/rolePermissions';
import { LoggerService } from '../services/util/LoggerService';

interface FilterOptions {
  label: string;
  value: string;
}

export function useCalendarFilters() {
  const [selectedFilial, setSelectedFilial] = useState<string | undefined>();
  const [selectedCliente, setSelectedCliente] = useState<string | undefined>();
  const [selectedFuncionario, setSelectedFuncionario] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  // Options for selects
  const [filialOptions, setFilialOptions] = useState<FilterOptions[]>([]);
  const [clienteOptions, setClienteOptions] = useState<FilterOptions[]>([]);
  const [funcionarioOptions, setFuncionarioOptions] = useState<FilterOptions[]>([]);

  // Get user role for permission checks
  const userRole = getUserRoleFromToken(localStorage.getItem('token'));
  const userFuncionarioId = getUserFuncionarioIdFromToken(localStorage.getItem('token'));

  // Load filial options
  useEffect(() => {
    const loadFiliais = async () => {
      try {
        const filiais = await BranchOfficeService.getAll();
        const options = filiais.map((f: any) => ({
          label: f.nome,
          value: f.id,
        }));
        setFilialOptions(options);

        // Auto-select if not multi-filial user
        if (options.length === 1) {
          setSelectedFilial(options[0].value);
        }
      } catch (error) {
        LoggerService.error('useCalendarFilters', 'Failed to load filiais', error);
      }
    };

    loadFiliais();
  }, []);

  // Load cliente options
  useEffect(() => {
    const loadClientes = async () => {
      try {
        const clientes = await getAllCustomersAsync();
        const options = (clientes || []).map((c: any) => ({
          label: c.nome,
          value: c.id,
        }));
        setClienteOptions(options);
      } catch (error) {
        LoggerService.error('useCalendarFilters', 'Failed to load clientes', error);
      }
    };

    loadClientes();
  }, []);

  // Load funcionario options
  useEffect(() => {
    const loadFuncionarios = async () => {
      try {
        const funcionarios = await EmployeeService.getAll();
        const options = (funcionarios || []).map((f: any) => ({
          label: f.nome,
          value: f.id,
        }));
        setFuncionarioOptions(options);

        // Auto-filter if user is a specific funcionario
        if (shouldApplyAgendaFilter(userRole) && userFuncionarioId) {
          setSelectedFuncionario(userFuncionarioId);
        }
      } catch (error) {
        LoggerService.error('useCalendarFilters', 'Failed to load funcionarios', error);
      }
    };

    loadFuncionarios();
  }, [userFuncionarioId]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedFilial(undefined);
    setSelectedCliente(undefined);
    setSelectedFuncionario(undefined);
    setFilterStatus(undefined);
  }, []);

  // Toggle filters visibility
  const toggleShowFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Build filter object for API call
  const getActiveFilters = useCallback(() => {
    return {
      filialId: selectedFilial,
      clienteId: selectedCliente,
      funcionarioId: selectedFuncionario,
      status: filterStatus ? parseInt(filterStatus) : undefined,
    };
  }, [selectedFilial, selectedCliente, selectedFuncionario, filterStatus]);

  return {
    // Filter state
    selectedFilial,
    setSelectedFilial,
    selectedCliente,
    setSelectedCliente,
    selectedFuncionario,
    setSelectedFuncionario,
    filterStatus,
    setFilterStatus,

    // UI state
    showFilters,
    toggleShowFilters,
    clearFilters,

    // Options
    filialOptions,
    clienteOptions,
    funcionarioOptions,

    // Active filters
    getActiveFilters,

    // Permissions
    userRole,
    canFilterByFuncionario: shouldApplyAgendaFilter(userRole),
  };
}
