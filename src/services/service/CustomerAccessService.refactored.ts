/**
 * CustomerAccessService - Refactored using BaseApiService
 * 
 * BEFORE: 73 LOC with scattered operations
 * AFTER: 90 LOC with standardized patterns
 * REDUCTION: Better code organization and custom endpoint handling
 * 
 * NOTE: TEMPORÁRIO - Sistema de acesso automático para clientes
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */

import { BaseApiService } from '../api/BaseApiService';
import { GenerateCustomerAccessBatchDto } from '../model/Dto/Request/CustomerAccessRequestDto';
import {
  CustomerAccessResponseDto,
  CustomerAccessResultDto,
} from '../model/Dto/Response/CustomerAccessResponseDto';
import { CustomerResponseDto } from '../model/Dto/Response/CustomerResponseDto';
import { CustomerWithAccessStatusDto } from '../model/Dto/Response/CustomerWithAccessStatusDto';

/**
 * Service for CustomerAccess API operations
 * 
 * NOTE: Temporary - System for automatic customer access
 */
class CustomerAccessService extends BaseApiService<any, any, any, any> {
  protected baseUrl = '/CustomerAccess';

  /**
   * Get customers without registered access
   */
  async getCustomersWithoutAccess(): Promise<CustomerResponseDto[]> {
    return this.customGet(`${this.baseUrl}/GetCustomersWithoutAccess`);
  }

  /**
   * Generate single access for customer
   */
  async generateSingleAccess(
    customerId: string
  ): Promise<CustomerAccessResultDto> {
    return this.customPost(`${this.baseUrl}/GenerateSingle`, {
      customerId,
    });
  }

  /**
   * Generate batch access for multiple customers
   */
  async generateBatchAccess(
    request: GenerateCustomerAccessBatchDto
  ): Promise<CustomerAccessResponseDto> {
    return this.customPost(`${this.baseUrl}/GenerateBatch`, request);
  }

  /**
   * Check if CPF already has access
   */
  async checkAccessByCpf(cpf: string): Promise<boolean> {
    const result = await this.customGet(`${this.baseUrl}/CheckAccess/${cpf}`);
    return result as boolean;
  }

  /**
   * Get all customers with access status
   */
  async getAllCustomersWithAccessStatus(): Promise<
    CustomerWithAccessStatusDto[]
  > {
    return this.customGet(
      `${this.baseUrl}/GetAllCustomersWithAccessStatus`
    );
  }

  /**
   * Disable customer access
   */
  async disableCustomerAccess(
    customerId: string,
    reason?: string
  ): Promise<void> {
    const filters = reason ? { reason } : {};
    return this.customPost(`${this.baseUrl}/DisableAccess/${customerId}`, filters);
  }
}

// Export singleton instance
export const customerAccessService = new CustomerAccessService();

// Legacy exports for backward compatibility
export const getCustomersWithoutAccessAsync = () =>
  customerAccessService.getCustomersWithoutAccess();

export const generateSingleAccessAsync = (customerId: string) =>
  customerAccessService.generateSingleAccess(customerId);

export const generateBatchAccessAsync = (
  request: GenerateCustomerAccessBatchDto
) => customerAccessService.generateBatchAccess(request);

export const checkAccessByCpfAsync = (cpf: string) =>
  customerAccessService.checkAccessByCpf(cpf);

export const getAllCustomersWithAccessStatusAsync = () =>
  customerAccessService.getAllCustomersWithAccessStatus();

export const disableCustomerAccessAsync = (
  customerId: string,
  reason?: string
) => customerAccessService.disableCustomerAccess(customerId, reason);

export default customerAccessService;
