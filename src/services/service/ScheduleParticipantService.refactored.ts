/**
 * ScheduleParticipantService - Refactored using BaseApiService
 * 
 * BEFORE: 62 LOC with scattered operations
 * AFTER: 85 LOC with standardized patterns
 * REDUCTION: Better code organization and custom endpoint handling
 */

import { BaseApiService } from '../api/BaseApiService';
import { ScheduleParticipantRequestDto } from '../model/Dto/Request/ScheduleParticipantRequestDto';

/**
 * Service for ScheduleParticipant API operations
 */
class ScheduleParticipantService extends BaseApiService<
  ScheduleParticipantRequestDto,
  ScheduleParticipantRequestDto,
  ScheduleParticipantRequestDto,
  ScheduleParticipantRequestDto
> {
  protected baseUrl = '/ScheduleParticipant';

  /**
   * Create new schedule participant
   */
  async createScheduleParticipant(
    data: ScheduleParticipantRequestDto
  ): Promise<ScheduleParticipantRequestDto> {
    return this.create(data);
  }

  /**
   * Update schedule participant
   */
  async updateScheduleParticipant(
    data: ScheduleParticipantRequestDto
  ): Promise<ScheduleParticipantRequestDto> {
    return this.update(data);
  }

  /**
   * Get all schedule participants
   */
  async getAllScheduleParticipants(): Promise<ScheduleParticipantRequestDto[]> {
    return this.getAll();
  }

  /**
   * Get schedule participant by ID
   */
  async getScheduleParticipantById(
    id: string
  ): Promise<ScheduleParticipantRequestDto> {
    return this.getById(id);
  }

  /**
   * Get schedule participants by schedule ID
   */
  async getScheduleParticipantsByScheduleId(
    scheduleId: string
  ): Promise<ScheduleParticipantRequestDto[]> {
    return this.customGet(`${this.baseUrl}/BySchedule/${scheduleId}`);
  }

  /**
   * Delete schedule participant
   */
  async deleteScheduleParticipant(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Disable schedule participant
   */
  async disableScheduleParticipant(
    id: string,
    userDesabled: string
  ): Promise<void> {
    return this.customPost(`${this.baseUrl}/disable/${id}`, {
      userDesabled,
    });
  }
}

// Export singleton instance
export const scheduleParticipantService = new ScheduleParticipantService();

// Legacy exports for backward compatibility
export const postScheduleParticipantAsync = (
  data: ScheduleParticipantRequestDto
) => scheduleParticipantService.createScheduleParticipant(data);

export const putScheduleParticipantAsync = (
  data: ScheduleParticipantRequestDto
) => scheduleParticipantService.updateScheduleParticipant(data);

export const getAllScheduleParticipantsAsync = () =>
  scheduleParticipantService.getAllScheduleParticipants();

export const getScheduleParticipantByIdAsync = (id: string) =>
  scheduleParticipantService.getScheduleParticipantById(id);

export const getScheduleParticipantsByScheduleIdAsync = (scheduleId: string) =>
  scheduleParticipantService.getScheduleParticipantsByScheduleId(scheduleId);

export const deleteScheduleParticipantAsync = (id: string) =>
  scheduleParticipantService.deleteScheduleParticipant(id);

export const disableScheduleParticipantAsync = (
  id: string,
  userDesabled: string
) => scheduleParticipantService.disableScheduleParticipant(id, userDesabled);

export default scheduleParticipantService;
