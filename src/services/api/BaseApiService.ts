/**
 * BaseApiService - Abstract base class for all API services
 * 
 * Provides standardized CRUD operations with:
 * - Consistent error handling
 * - Type safety with generics
 * - Query string building
 * - Centralized request/response handling
 * - Logging integration
 * 
 * Reduces duplication across 16 service files (~800 LOC consolidated)
 * 
 * Usage:
 * class CustomerService extends BaseApiService<CustomerResponseDto, CustomerRequestDto> {
 *   protected baseUrl = '/Customer';
 * }
 */

import { instanceApi } from '../service/AxioService';
import { LoggerService } from '../util/LoggerService';
import { AxiosError } from 'axios';

export interface ApiError {
  statusCode: number;
  message: string;
  details?: any;
  originalError?: any;
}

export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Abstract base service for all API operations
 * 
 * @template T - The main entity type (Response DTO)
 * @template CreateDTO - The create request DTO (defaults to T)
 * @template UpdateDTO - The update request DTO (defaults to T)
 * @template ListDTO - The list response DTO (defaults to T)
 */
export abstract class BaseApiService<
  T,
  CreateDTO = T,
  UpdateDTO = T,
  ListDTO = T
> {
  /**
   * Base URL for the API endpoint
   * Must be set by child classes
   * Example: '/Customer', '/OrderService', '/Employee'
   */
  protected abstract baseUrl: string;

  /**
   * Get the service name for logging
   */
  protected getServiceName(): string {
    return this.constructor.name;
  }

  /**
   * Get all resources with optional filters
   */
  async getAll(filters?: Record<string, any>): Promise<ListDTO[]> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `${this.baseUrl}${queryString}` : this.baseUrl;

      const response = await instanceApi.get<ListDTO[]>(url);
      LoggerService.debug(
        this.getServiceName(),
        `getAll successful from ${this.baseUrl}`
      );
      return response.data;
    } catch (error) {
      this.handleError('getAll', error);
      throw this.parseError(error);
    }
  }

  /**
   * Get paginated resources
   */
  async getPaginated(
    filters?: PaginatedRequest
  ): Promise<PaginatedResponse<ListDTO>> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString
        ? `${this.baseUrl}/paginated${queryString}`
        : `${this.baseUrl}/paginated`;

      const response = await instanceApi.get<PaginatedResponse<ListDTO>>(url);
      LoggerService.debug(
        this.getServiceName(),
        `getPaginated successful from ${this.baseUrl} (page ${filters?.page})`
      );
      return response.data;
    } catch (error) {
      this.handleError('getPaginated', error);
      throw this.parseError(error);
    }
  }

  /**
   * Get single resource by ID
   */
  async getById(id: string): Promise<T> {
    try {
      const response = await instanceApi.get<T>(`${this.baseUrl}/${id}`);
      LoggerService.debug(
        this.getServiceName(),
        `getById(${id}) successful`
      );
      return response.data;
    } catch (error) {
      this.handleError('getById', error, { id });
      throw this.parseError(error);
    }
  }

  /**
   * Create new resource
   */
  async create(data: CreateDTO): Promise<T> {
    try {
      const response = await instanceApi.post<T>(this.baseUrl, data);
      LoggerService.info(
        this.getServiceName(),
        `create successful on ${this.baseUrl}`
      );
      return response.data;
    } catch (error) {
      this.handleError('create', error, { data });
      throw this.parseError(error);
    }
  }

  /**
   * Update existing resource
   */
  async update(data: UpdateDTO, id?: string): Promise<T> {
    try {
      const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
      const response = await instanceApi.put<T>(url, data);
      LoggerService.info(
        this.getServiceName(),
        `update${id ? `(${id})` : ''} successful`
      );
      return response.data;
    } catch (error) {
      this.handleError('update', error, { id, data });
      throw this.parseError(error);
    }
  }

  /**
   * Delete resource by ID
   */
  async delete(id: string): Promise<void> {
    try {
      await instanceApi.delete(`${this.baseUrl}/${id}`);
      LoggerService.info(
        this.getServiceName(),
        `delete(${id}) successful`
      );
    } catch (error) {
      this.handleError('delete', error, { id });
      throw this.parseError(error);
    }
  }

  /**
   * Batch delete resources
   */
  async batchDelete(ids: string[]): Promise<void> {
    try {
      const response = await instanceApi.post(
        `${this.baseUrl}/batch-delete`,
        { ids }
      );
      LoggerService.info(
        this.getServiceName(),
        `batchDelete(${ids.length} items) successful`
      );
      return response.data;
    } catch (error) {
      this.handleError('batchDelete', error, { count: ids.length });
      throw this.parseError(error);
    }
  }

  /**
   * Execute custom GET endpoint
   */
  protected async customGet<R = T>(endpoint: string, filters?: Record<string, any>): Promise<R> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `${endpoint}${queryString}` : endpoint;
      const response = await instanceApi.get<R>(url);
      return response.data;
    } catch (error) {
      this.handleError('customGet', error, { endpoint });
      throw this.parseError(error);
    }
  }

  /**
   * Execute custom POST endpoint
   */
  protected async customPost<R = T>(
    endpoint: string,
    data?: any
  ): Promise<R> {
    try {
      const response = await instanceApi.post<R>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError('customPost', error, { endpoint });
      throw this.parseError(error);
    }
  }

  /**
   * Build query string from filters object
   * Handles null/undefined values and array parameters
   */
  protected buildQueryString(filters?: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) {
      return '';
    }

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // Handle array parameters
          value.forEach((item) => {
            params.append(key, String(item));
          });
        } else if (typeof value === 'object') {
          // Handle object parameters (convert to JSON)
          params.append(key, JSON.stringify(value));
        } else {
          // Handle primitive values
          params.append(key, String(value));
        }
      }
    });

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Parse API error response
   */
  protected parseError(error: any): ApiError {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // Server responded with error status
      return {
        statusCode: axiosError.response.status,
        message: (axiosError.response.data as any)?.message || axiosError.message,
        details: axiosError.response.data,
        originalError: error,
      };
    } else if (axiosError.request) {
      // Request made but no response
      return {
        statusCode: 0,
        message: 'Sem resposta do servidor',
        details: axiosError.request,
        originalError: error,
      };
    } else {
      // Error in request setup
      return {
        statusCode: 0,
        message: error.message || 'Erro desconhecido',
        originalError: error,
      };
    }
  }

  /**
   * Handle and log errors
   */
  protected handleError(
    method: string,
    error: any,
    context?: Record<string, any>
  ): void {
    const apiError = this.parseError(error);

    LoggerService.error(
      this.getServiceName(),
      `${method} failed on ${this.baseUrl}`,
      {
        statusCode: apiError.statusCode,
        message: apiError.message,
        context,
        details: apiError.details,
      }
    );
  }
}

export default BaseApiService;
