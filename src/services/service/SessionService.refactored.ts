/**
 * SessionService - Refactored using BaseApiService
 * 
 * BEFORE: 58 LOC with scattered operations
 * AFTER: 85 LOC with standardized patterns
 * REDUCTION: Better code organization and custom endpoint handling
 */

import { BaseApiService } from '../api/BaseApiService';
import { OrderServiceSessionRequestDto } from '../model/Dto/Request/OrderServiceSessionRequestDto';
import { OrderServiceSessionResponseDto } from '../model/Dto/Response/OrderServiceSessionResponseDto';
import { DailySessionsSummaryResponseDto } from '../model/Dto/Response/DailySessionsSummaryResponseDto';

/**
 * Service for Session API operations
 */
class SessionService extends BaseApiService<
  OrderServiceSessionResponseDto,
  OrderServiceSessionRequestDto,
  OrderServiceSessionRequestDto,
  OrderServiceSessionResponseDto
> {
  protected baseUrl = '/SessionService';

  /**
   * Create new session
   */
  async createSession(
    data: OrderServiceSessionRequestDto
  ): Promise<OrderServiceSessionResponseDto> {
    return this.create(data);
  }

  /**
   * Get all sessions, optionally filtered by clienteId
   */
  async getAllSessions(
    clienteId?: string
  ): Promise<OrderServiceSessionResponseDto[]> {
    return this.customGet(`${this.baseUrl}/GetByAllSessionService`, {
      clienteId,
    });
  }

  /**
   * Get session by ID
   */
  async getSessionById(id: string): Promise<OrderServiceSessionResponseDto> {
    return this.getById(id);
  }

  /**
   * Get daily sessions summary
   */
  async getDailySessionsSummary(
    date?: string
  ): Promise<DailySessionsSummaryResponseDto> {
    return this.customGet(`${this.baseUrl}/daily-summary`, { date });
  }

  /**
   * Delete session
   */
  async deleteSession(id: string): Promise<void> {
    return this.delete(id);
  }
}

// Export singleton instance
export const sessionService = new SessionService();

// Legacy exports for backward compatibility
export const createSessionAsync = (data: OrderServiceSessionRequestDto) =>
  sessionService.createSession(data);

export const getAllSessionsAsync = (clienteId?: string) =>
  sessionService.getAllSessions(clienteId);

export const getSessionByIdAsync = (id: string) =>
  sessionService.getSessionById(id);

export const getDailySessionsSummaryAsync = (date?: string) =>
  sessionService.getDailySessionsSummary(date);

export const deleteSessionAsync = (id: string) =>
  sessionService.deleteSession(id);

export default sessionService;
