/**
 * useFormOrderService - Hook principal para FormOrderService
 * 
 * Gerencia:
 * - Estado do formulário
 * - Carregamento de opções (clientes, serviços, funcionários)
 * - Mutações de criação/atualização
 * - Integração com os outros hooks
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { LoggerService } from '../services/util/LoggerService';
import {
  createOrderServiceAsync,
  updateOrderServiceAsync,
} from '../services/service/OrderServiceService';
import { getAllCustomersAsync } from '../services/service/CustomerService';
import { getAllSubCategoriasAsync } from '../services/service/SubCategoryService';
import EmployeeService from '../services/service/EmployeeService';
import { BranchOfficeService } from '../services/service/BranchOfficeService';
import { OrderServiceRequestDto } from '../services/model/Dto/Request/OrderServiceRequestDto';
import { OrderServiceResponseDto } from '../services/model/Dto/Response/OrderServiceResponseDto';

interface FormOptions {
  customers: Array<{ label: string; value: string }>;
  services: Array<{ label: string; value: string }>;
  employees: Array<{ label: string; value: string }>;
  branches: Array<{ label: string; value: string }>;
}

export function useFormOrderService(initialData?: OrderServiceResponseDto) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<OrderServiceRequestDto>(
    initialData || {
      referencia: '',
      status: 0,
      precoOrdem: 0,
      precoDesconto: 0,
      percentualGanho: 0,
      precoDescontado: 0,
      descontoPercentual: 0,
      formaPagamento: 0,
      clienteId: '',
      funcionarioId: '',
      dataPagamento: new Date().toISOString().split('T')[0],
      qtdSessaoTotal: 0,
      qtdSessaoRealizada: 1,
      servicos: [],
      sessoes: [],
    }
  );

  const [formOptions, setFormOptions] = useState<FormOptions>({
    customers: [],
    services: [],
    employees: [],
    branches: [],
  });

  // Carregar clientes
  const { isLoading: loadingCustomers } = useQuery({
    queryKey: ['customers'] as const,
    queryFn: getAllCustomersAsync as () => Promise<any[]>,
    onSuccess: (data: any) => {
      const options = (data || []).map((c: any) => ({
        label: c.nome,
        value: c.id,
      }));
      setFormOptions((prev) => ({
        ...prev,
        customers: options,
      }));
    },
    onError: (error: any) => {
      LoggerService.error('useFormOrderService', 'Failed to load customers', error);
      toast.error('Erro ao carregar clientes');
    },
  });

  // Carregar serviços
  const { isLoading: loadingServices } = useQuery({
    queryKey: ['services'] as const,
    queryFn: getAllSubCategoriasAsync as () => Promise<any[]>,
    onSuccess: (data: any) => {
      const options = (data || []).map((s: any) => ({
        label: s.nome,
        value: s.id,
      }));
      setFormOptions((prev) => ({
        ...prev,
        services: options,
      }));
    },
    onError: (error: any) => {
      LoggerService.error('useFormOrderService', 'Failed to load services', error);
      toast.error('Erro ao carregar serviços');
    },
  });

  // Carregar funcionários
  const { isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => EmployeeService.getAll(),
    onSuccess: (data: any) => {
      const options = (data || []).map((e: any) => ({
        label: e.nome,
        value: e.id,
      }));
      setFormOptions((prev) => ({
        ...prev,
        employees: options,
      }));
    },
    onError: (error: any) => {
      LoggerService.error('useFormOrderService', 'Failed to load employees', error);
      toast.error('Erro ao carregar funcionários');
    },
  });

  // Carregar filiais
  const { isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => BranchOfficeService.getAll(),
    onSuccess: (data: any) => {
      const options = (data || []).map((b: any) => ({
        label: b.nome,
        value: b.id,
      }));
      setFormOptions((prev) => ({
        ...prev,
        branches: options,
      }));
    },
    onError: (error: any) => {
      LoggerService.error('useFormOrderService', 'Failed to load branches', error);
      toast.error('Erro ao carregar filiais');
    },
  });

  /**
   * Atualizar campo do formulário
   */
  const updateFormField = useCallback(
    <K extends keyof OrderServiceRequestDto>(
      field: K,
      value: OrderServiceRequestDto[K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  /**
   * Atualizar múltiplos campos
   */
  const updateFormFields = useCallback(
    (updates: Partial<OrderServiceRequestDto>) => {
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  /**
   * Validar formulário
   */
  const isFormValid = useCallback((): boolean => {
    return (
      !!formData.referencia &&
      !!formData.clienteId &&
      !!formData.funcionarioId &&
      (formData.precoOrdem ?? 0) > 0 &&
      (formData.servicos?.length ?? 0) > 0
    );
  }, [formData]);

  /**
   * Resetar formulário
   */
  const resetForm = useCallback(() => {
    setFormData({
      referencia: '',
      status: 0,
      precoOrdem: 0,
      precoDesconto: 0,
      percentualGanho: 0,
      precoDescontado: 0,
      descontoPercentual: 0,
      formaPagamento: 0,
      clienteId: '',
      funcionarioId: '',
      dataPagamento: new Date().toISOString().split('T')[0],
      qtdSessaoTotal: 0,
      qtdSessaoRealizada: 1,
      servicos: [],
      sessoes: [],
    });
  }, []);

  /**
   * Mutation para criar ordem de serviço
   */
  const createMutation = useMutation({
    mutationFn: (data: OrderServiceRequestDto) => createOrderServiceAsync(data),
    onSuccess: (newOrder) => {
      LoggerService.info('useFormOrderService', 'Order service created successfully');
      toast.success('Ordem de serviço criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['orderServices'] });
      return newOrder;
    },
    onError: (error) => {
      LoggerService.error('useFormOrderService', 'Failed to create order service', error);
      toast.error('Erro ao criar ordem de serviço');
    },
  });

  /**
   * Mutation para atualizar ordem de serviço
   */
  const updateMutation = useMutation({
    mutationFn: (data: OrderServiceRequestDto) => updateOrderServiceAsync(data),
    onSuccess: () => {
      LoggerService.info('useFormOrderService', 'Order service updated successfully');
      toast.success('Ordem de serviço atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['orderServices'] });
    },
    onError: (error) => {
      LoggerService.error('useFormOrderService', 'Failed to update order service', error);
      toast.error('Erro ao atualizar ordem de serviço');
    },
  });

  /**
   * Submeter formulário
   */
  const submitForm = useCallback(
    (isEditing: boolean = false) => {
      if (!isFormValid()) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      if (isEditing) {
        updateMutation.mutate(formData);
      } else {
        createMutation.mutate(formData);
      }
    },
    [formData, isFormValid, createMutation, updateMutation]
  );

  return {
    // Dados
    formData,
    formOptions,

    // Atualizar
    updateFormField,
    updateFormFields,
    setFormData,

    // Validação
    isFormValid,
    isLoading:
      loadingCustomers ||
      loadingServices ||
      loadingEmployees ||
      loadingBranches,

    // Mutações
    createOrderService: createMutation.mutate,
    updateOrderService: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,

    // Utilidades
    submitForm,
    resetForm,
  };
}

export default useFormOrderService;
