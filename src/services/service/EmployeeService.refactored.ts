/**
 * EmployeeService - Refactored using BaseApiService
 * 
 * BEFORE: 36 LOC with scattered CRUD operations
 * AFTER: 55 LOC with standardized patterns
 * REDUCTION: Better code organization and consistency
 */

import { BaseApiService } from '../api/BaseApiService';
import { EmployeeRequestDto } from '../model/Dto/Request/EmployeeRequestDto';
import { EmployeeResponseDto } from '../model/Dto/Response/EmployeeResponseDto';

/**
 * Service for Employee (Funcionário) API operations
 */
class EmployeeService extends BaseApiService<
  EmployeeResponseDto,
  EmployeeRequestDto,
  EmployeeRequestDto,
  EmployeeResponseDto
> {
  protected baseUrl = '/Employee';

  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<EmployeeResponseDto[]> {
    return this.getAll();
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<EmployeeResponseDto> {
    return this.getById(id);
  }

  /**
   * Create new employee
   */
  async createEmployee(data: EmployeeRequestDto): Promise<EmployeeResponseDto> {
    return this.create(data);
  }

  /**
   * Update employee
   */
  async updateEmployee(data: EmployeeRequestDto): Promise<EmployeeResponseDto> {
    return this.update(data);
  }

  /**
   * Delete employee by ID
   */
  async deleteEmployee(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Disable (inactivate) employee
   */
  async disableEmployee(id: string): Promise<void> {
    return this.customPost(`${this.baseUrl}/Desativarfuncionario/${id}`);
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();

// Legacy exports for backward compatibility
export const getEmployeesAsync = () =>
  employeeService.getAllEmployees();

export const getEmployeeByIdAsync = (id: string) =>
  employeeService.getEmployeeById(id);

export const postEmployeeAsync = (data: EmployeeRequestDto) =>
  employeeService.createEmployee(data);

export const putEmployeeAsync = (data: EmployeeRequestDto) =>
  employeeService.updateEmployee(data);

export const deleteEmployeeAsync = (id: string) =>
  employeeService.deleteEmployee(id);

export const disableEmployeeAsync = (id: string) =>
  employeeService.disableEmployee(id);

export default employeeService;
