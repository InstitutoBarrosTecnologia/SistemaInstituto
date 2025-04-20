
import { CategoryServiceResquestDto } from "../model/Dto/Request/CategoryServiceResquestDto";
import { CategoryServiceResponseDto } from "../model/Dto/Response/CategoryServiceResponseDto";
import { instanceApi } from "./AxioService";


export const createCategoriaAsync = async (
  request: CategoryServiceResquestDto
): Promise<{ data: CategoryServiceResponseDto; status: number }> => {
  const response = await instanceApi.post<CategoryServiceResponseDto>(
    "/CategoryService",
    request
  );
  return {
    data: response.data,
    status: response.status,
  };
};

export const getAllCategoriasAsync = async (
  titulo?: string,
  desc?: string
): Promise<CategoryServiceResponseDto[] | string> => {
  const query = new URLSearchParams();
  if (titulo) query.append("titulo", titulo);
  if (desc) query.append("desc", desc);

  const response = await instanceApi.get<CategoryServiceResponseDto[] | string>(
    `/CategoryService?${query.toString()}`
  );
  return response.data;
};

export const getCategoriaByIdAsync = async (
  id: string
): Promise<CategoryServiceResponseDto | string> => {
  const response = await instanceApi.get<CategoryServiceResponseDto | string>(
    `/CategoryService/${id}`
  );
  return response.data;
};

export const updateCategoriaAsync = async (
  request: CategoryServiceResquestDto
): Promise<{ data: CategoryServiceResponseDto; status: number }> => {
  const response = await instanceApi.put<CategoryServiceResponseDto>(
    "/CategoryService",
    request
  );
  return {
    data: response.data,
    status: response.status,
  };
};

export const desativarCategoriaAsync = async (
  id: string
): Promise<boolean> => {
  const response = await instanceApi.put<boolean>(
    `/CategoryService/DesativarCategoria?id=${id}`
  );
  return response.data;
};

export const deletarCategoriaAsync = async (
  id: string
): Promise<string> => {
  const response = await instanceApi.delete<string>(
    `/CategoryService?id=${id}`
  );
  return response.data;
};
