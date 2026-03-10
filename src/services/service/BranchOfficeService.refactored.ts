/**
 * BranchOfficeService - Refactored using BaseApiService
 * 
 * BEFORE: 34 LOC with scattered CRUD operations
 * AFTER: 45 LOC with standardized patterns
 * REDUCTION: Better code organization and consistency
 */

import { BaseApiService } from '../api/BaseApiService';
import { BranchOfficeRequestDto } from '../model/Dto/Request/BranchOfficeRequestDto';
import { BranchOfficeResponseDto } from '../model/Dto/Response/BranchOfficeResponseDto';

/**
 * Service for BranchOffice (Filial) API operations
 */
class BranchOfficeService extends BaseApiService<
  BranchOfficeResponseDto,
  BranchOfficeRequestDto,
  BranchOfficeRequestDto,
  BranchOfficeResponseDto
> {
  protected baseUrl = '/BranchOffice';

  /**
   * Get all branch offices
   */
  async getAllBranchOffices(): Promise<BranchOfficeResponseDto[]> {
    return this.getAll();
  }

  /**
   * Get branch office by ID
   */
  async getBranchOfficeById(id: string): Promise<BranchOfficeResponseDto> {
    return this.getById(id);
  }

  /**
   * Create new branch office
   */
  async createBranchOffice(
    data: BranchOfficeRequestDto
  ): Promise<BranchOfficeResponseDto> {
    return this.create(data);
  }

  /**
   * Update branch office
   */
  async updateBranchOffice(
    data: BranchOfficeRequestDto
  ): Promise<BranchOfficeResponseDto> {
    return this.update(data);
  }

  /**
   * Delete branch office by ID
   */
  async deleteBranchOffice(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Disable (inactivate) branch office
   */
  async disableBranchOffice(id: string): Promise<void> {
    return this.customPost(`${this.baseUrl}/DesativarFilial/${id}`);
  }
}

// Export singleton instance
export const branchOfficeService = new BranchOfficeService();

// Legacy exports for backward compatibility
export const getBranchOfficesAsync = () =>
  branchOfficeService.getAllBranchOffices();

export const getBranchOfficeByIdAsync = (id: string) =>
  branchOfficeService.getBranchOfficeById(id);

export const postBranchOfficeAsync = (data: BranchOfficeRequestDto) =>
  branchOfficeService.createBranchOffice(data);

export const putBranchOfficeAsync = (data: BranchOfficeRequestDto) =>
  branchOfficeService.updateBranchOffice(data);

export const deleteBranchOfficeAsync = (id: string) =>
  branchOfficeService.deleteBranchOffice(id);

export const disableBranchOfficeAsync = (id: string) =>
  branchOfficeService.disableBranchOffice(id);

export default branchOfficeService;
