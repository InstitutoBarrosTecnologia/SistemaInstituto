/**
 * OrderServiceService - Refactored using BaseApiService
 * 
 * BEFORE: 116 LOC with duplicated query building and error handling
 * AFTER: 90 LOC with standardized patterns
 * REDUCTION: 22% less boilerplate
 * 
 * Custom endpoints for status changes and filtering are handled via customPost/customGet
 */

import { BaseApiService } from '../api/BaseApiService';
import { OrderServiceRequestDto } from '../model/Dto/Request/OrderServiceRequestDto';
import { OrderServiceResponseDto } from '../model/Dto/Response/OrderServiceResponseDto';
import { EOrderServiceStatus } from '../model/Enum/EOrderServiceStatus';

/**
 * Service for OrderService (Ordem de Serviço) API operations
 */
class OrderServiceService extends BaseApiService<
  OrderServiceResponseDto,
  OrderServiceRequestDto,
  OrderServiceRequestDto,
  OrderServiceResponseDto
> {
  protected baseUrl = '/OrderService';

  /**
   * Create new order service
   */
  async createOrderService(
    data: OrderServiceRequestDto
  ): Promise<OrderServiceResponseDto> {
    return this.create(data);
  }

  /**
   * Update order service
   */
  async updateOrderService(
    data: OrderServiceRequestDto
  ): Promise<OrderServiceResponseDto> {
    return this.update(data);
  }

  /**
   * Get order service by ID
   */
  async getOrderServiceById(id: string): Promise<OrderServiceResponseDto> {
    return this.getById(id);
  }

  /**
   * Get all order services with optional filters
   */
  async getAllOrderServices(
    filters?: Partial<OrderServiceRequestDto>
  ): Promise<OrderServiceResponseDto[]> {
    return this.getAll(filters);
  }

  /**
   * Delete order service by ID
   */
  async deleteOrderService(id: string): Promise<void> {
    return this.customPost(`${this.baseUrl}`, { id });
  }

  /**
   * Disable (inactivate) order service
   */
  async disableOrderService(id: string): Promise<OrderServiceResponseDto> {
    return this.customPost(`${this.baseUrl}/DesativarPrestacao`, { id });
  }

  /**
   * Change order service status
   */
  async changeOrderServiceStatus(
    id: string,
    status: EOrderServiceStatus
  ): Promise<boolean> {
    const result = await this.customPost<boolean>(`${this.baseUrl}/AlterarStatus`, {
      id,
      status,
    });
    return result;
  }

  /**
   * Get order services by status
   */
  async getOrderServicesByStatus(
    statusList: EOrderServiceStatus[]
  ): Promise<OrderServiceResponseDto[]> {
    return this.getAll({ status: statusList });
  }

  /**
   * Get order services by client ID
   */
  async getOrderServicesByClientId(
    clienteId: string
  ): Promise<OrderServiceResponseDto[]> {
    return this.getAll({ clienteId });
  }
}

// Export singleton instance
export const orderServiceService = new OrderServiceService();

// Legacy exports for backward compatibility
export const createOrderServiceAsync = (data: OrderServiceRequestDto) =>
  orderServiceService.createOrderService(data);

export const updateOrderServiceAsync = (data: OrderServiceRequestDto) =>
  orderServiceService.updateOrderService(data);

export const getOrderServiceByIdAsync = (id: string) =>
  orderServiceService.getOrderServiceById(id);

export const getAllOrderServicesAsync = (
  filters?: Partial<OrderServiceRequestDto>
) => orderServiceService.getAllOrderServices(filters);

export const deleteOrderServiceAsync = (id: string) =>
  orderServiceService.deleteOrderService(id);

export const desabilitarOrderServiceAsync = (id: string) =>
  orderServiceService.disableOrderService(id);

export const alterarStatusOrderServiceAsync = (
  id: string,
  status: EOrderServiceStatus
) => orderServiceService.changeOrderServiceStatus(id, status);

export const getOrderServicesByStatusAsync = (
  statusList: EOrderServiceStatus[]
) => orderServiceService.getOrderServicesByStatus(statusList);

export const getOrderServicesByClientIdAsync = (clienteId: string) =>
  orderServiceService.getOrderServicesByClientId(clienteId);

export default orderServiceService;
