export interface UserResponseDto {
    id: string;
    userName: string;
    email: string;
    roles?: string[];
    funcionarioId?: string;
  }