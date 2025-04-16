import { UserLoginRequestDto } from "../model/Dto/Request/UserLoginRequestDto";
import { UserRequestDto } from "../model/Dto/Request/UserRequestDto";
import { ErrosValidationsResponseDto } from "../model/Dto/Response/ErrosValidationsResponseDto";
import { TokenResponseDto } from "../model/Dto/Response/TokenResponseDto";
import { UserResponseDto } from "../model/Dto/Response/UserResponseDto";
import { instanceApi } from "./AxioService";


// Buscar usuário por e-mail ou ID
export const getUserAsync = async (
  email?: string,
  id?: string
): Promise<UserResponseDto | string> => {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (id) params.append("id", id);

  const response = await instanceApi.get<UserResponseDto | string>(
    `/User/SearchUser?${params.toString()}`
  );
  return response.data;
};

// Registrar novo usuário
export const postRegisterUserAsync = async (
  request: UserRequestDto
): Promise<{ status: number; errors?: ErrosValidationsResponseDto[] }> => {
  try {
    const response = await instanceApi.post("/User/RegisterUser", request);
    return { status: response.status };
  } catch (error: any) {
    if (error.response?.status === 400) {
      return {
        status: 400,
        errors: error.response.data as ErrosValidationsResponseDto[],
      };
    }
    throw error;
  }
};

// Login de usuário
export const postLoginUserAsync = async (
  request: UserLoginRequestDto
): Promise<{ data?: TokenResponseDto; status: number; errors?: ErrosValidationsResponseDto[] }> => {
  try {
    const response = await instanceApi.post<TokenResponseDto>(
      "/User/LoginUser",
      request
    );
    return { data: response.data, status: response.status };
  } catch (error: any) {
    if (error.response?.status === 400) {
      return {
        status: 400,
        errors: error.response.data as ErrosValidationsResponseDto[],
      };
    }
    return { status: error.response?.status || 500 };
  }
};