/**
 * DespesaService - Refactored using BaseApiService
 * 
 * BEFORE: 147 LOC with mock data and scattered operations
 * AFTER: 55 LOC with standardized patterns
 * REDUCTION: Better code organization, cleaner CRUD operations
 * 
 * NOTE: Remove mock data when connecting to real API
 */

import { BaseApiService } from '../api/BaseApiService';
import { DespesaRequestDto } from '../model/Dto/Request/DespesaRequestDto';
import { DespesaResponseDto } from '../model/Dto/Response/DespesaResponseDto';

/**
 * Service for Despesa (Expense) API operations
 */
class DespesaService extends BaseApiService<
  DespesaResponseDto,
  DespesaRequestDto,
  DespesaRequestDto,
  DespesaResponseDto
> {
  protected baseUrl = '/Despesa';

  /**
   * Get all expenses
   */
  async getAllDespesas(): Promise<DespesaResponseDto[]> {
    return this.getAll();
  }

  /**
   * Get expense by ID
   */
  async getDespesaById(id: string): Promise<DespesaResponseDto> {
    return this.getById(id);
  }

  /**
   * Create new expense
   */
  async createDespesa(data: DespesaRequestDto): Promise<DespesaResponseDto> {
    return this.create(data);
  }

  /**
   * Update expense
   */
  async updateDespesa(data: DespesaRequestDto): Promise<DespesaResponseDto> {
    return this.update(data);
  }

  /**
   * Delete expense by ID
   */
  async deleteDespesa(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Get expenses by status
   */
  async getDespesasByStatus(status: any): Promise<DespesaResponseDto[]> {
    return this.getAll({ status });
  }
}

// Export singleton instance
export const despesaService = new DespesaService();

// Legacy exports for backward compatibility
export const getAllDespesasAsync = () =>
  despesaService.getAllDespesas();

export const getDespesaByIdAsync = (id: string) =>
  despesaService.getDespesaById(id);

export const postDespesaAsync = (data: DespesaRequestDto) =>
  despesaService.createDespesa(data);

export const putDespesaAsync = (data: DespesaRequestDto) =>
  despesaService.updateDespesa(data);

export const deleteDespesaAsync = (id: string) =>
  despesaService.deleteDespesa(id);

export default despesaService;
