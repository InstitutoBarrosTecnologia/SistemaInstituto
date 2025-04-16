export interface TokenResponseDto {
    authenticated: boolean;
    created?: string;
    expiration?: string;
    accessToken?: string;
    message?: string;
    roles: string[];
    userName: string;
  }