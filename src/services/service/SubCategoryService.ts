import { SubCategoryServiceRequestDto } from "../model/Dto/Request/SubCategoryServiceRequestDto";
import { SubCategoryServiceResponseDto } from "../model/Dto/Response/SubCategoryServiceResponseDto";
import { instanceApi } from "./AxioService";


export const createSubCategoriaAsync = async (
  request: SubCategoryServiceRequestDto
): Promise<{ data: SubCategoryServiceResponseDto; status: number }> => {
  const response = await instanceApi.post<SubCategoryServiceResponseDto>(
    "/SubCategory",
    request
  );
  return {
    data: response.data,
    status: response.status,
  };
};

export const getAllSubCategoriasAsync = async (
  titulo?: string,
  desc?: string
): Promise<SubCategoryServiceResponseDto[] | string> => {
  const query = new URLSearchParams();
  if (titulo) query.append("titulo", titulo);
  if (desc) query.append("desc", desc);

  const response = await instanceApi.get<SubCategoryServiceResponseDto[] | string>(
    `/SubCategory?${query.toString()}`
  );
  return response.data;
};

export const getSubCategoriaByIdAsync = async (
  id: string
): Promise<SubCategoryServiceResponseDto | string> => {
  const response = await instanceApi.get<SubCategoryServiceResponseDto | string>(
    `/SubCategory/${id}`
  );
  return response.data;
};

export const updateSubCategoriaAsync = async (
  request: SubCategoryServiceRequestDto
): Promise<{ data: SubCategoryServiceResponseDto; status: number }> => {
  const response = await instanceApi.put<SubCategoryServiceResponseDto>(
    "/SubCategory",
    request
  );
  return {
    data: response.data,
    status: response.status,
  };
};

export const desativarSubCategoriaAsync = async (
  id: string
): Promise<boolean> => {
  const response = await instanceApi.put<boolean>(
    `/SubCategory/DesativarSubServico?id=${id}`
  );
  return response.data;
};

export const deletarSubCategoriaAsync = async (
  id: string
): Promise<string> => {
  const response = await instanceApi.delete<string>(
    `/SubCategory?id=${id}`
  );
  return response.data;
};