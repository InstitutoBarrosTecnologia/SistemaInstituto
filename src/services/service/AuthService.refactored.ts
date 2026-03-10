/**
 * AuthService - Refactored using BaseApiService
 * 
 * BEFORE: 61 LOC with duplicated query building logic and error handling scattered
 * AFTER: 80 LOC with standardized patterns and better error management
 * 
 * Note: This service has custom logic that extends BaseApiService
 * (login validation, user search, registration with error handling)
 */

import { BaseApiService } from '../api/BaseApiService';
import { UserRequestDto } from '../model/Dto/Request/UserRequestDto';
import { UserLoginRequestDto } from '../model/Dto/Request/UserLoginRequestDto';
import { UserResponseDto } from '../model/Dto/Response/UserResponseDto';
import { TokenResponseDto } from '../model/Dto/Response/TokenResponseDto';
import { ErrosValidationsResponseDto } from '../model/Dto/Response/ErrosValidationsResponseDto';

/**
 * Service for User/Authentication API operations
 */
class AuthService extends BaseApiService<
  UserResponseDto,
  UserRequestDto,
  UserRequestDto,
  UserResponseDto
> {
  protected baseUrl = '/User';

  /**
   * Search user by email or ID
   */
  async searchUser(email?: string, id?: string): Promise<UserResponseDto> {
    const filters: Record<string, string> = {};
    if (email) filters['email'] = email;
    if (id) filters['id'] = id;
    
    return this.customGet(`${this.baseUrl}/SearchUser`, filters);
  }

  /**
   * Register new user with validation error handling
   */
  async registerUser(
    request: UserRequestDto
  ): Promise<{
    status: number;
    data?: UserResponseDto;
    errors?: ErrosValidationsResponseDto[];
  }> {
    try {
      const data = await this.customPost<UserResponseDto>(
        `${this.baseUrl}/RegisterUser`,
        request
      );
      return { status: 201, data };
    } catch (error: any) {
      if (error.statusCode === 400) {
        return {
          status: 400,
          errors: error.details as ErrosValidationsResponseDto[],
        };
      }
      throw error;
    }
  }

  /**
   * Login user and return token
   */
  async loginUser(
    request: UserLoginRequestDto
  ): Promise<{
    status: number;
    data?: TokenResponseDto;
    errors?: ErrosValidationsResponseDto[];
  }> {
    try {
      const data = await this.customPost<TokenResponseDto>(
        `${this.baseUrl}/LoginUser`,
        request
      );
      return { status: 200, data };
    } catch (error: any) {
      if (error.statusCode === 400) {
        return {
          status: 400,
          errors: error.details as ErrosValidationsResponseDto[],
        };
      }
      return { status: error.statusCode || 500 };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Legacy exports for backward compatibility
export const getUserAsync = (email?: string, id?: string) =>
  authService.searchUser(email, id);

export const postRegisterUserAsync = (request: UserRequestDto) =>
  authService.registerUser(request);

export const postLoginUserAsync = (request: UserLoginRequestDto) =>
  authService.loginUser(request);

export default authService;
