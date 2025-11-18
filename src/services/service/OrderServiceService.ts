import { instanceApi } from "./AxioService";
import { OrderServiceRequestDto } from "../model/Dto/Request/OrderServiceRequestDto";
import { OrderServiceResponseDto } from "../model/Dto/Response/OrderServiceResponseDto";
import { EOrderServiceStatus } from "../model/Enum/EOrderServiceStatus";

// Criar ordem de serviço
export const createOrderServiceAsync = async (
  request: OrderServiceRequestDto
): Promise<{ data: OrderServiceResponseDto; status: number }> => {
  const response = await instanceApi.post<OrderServiceResponseDto>(
    "/OrderService",
    request
  );
  return {
    data: response.data,
    status: response.status,
  };
};

// Atualizar ordem de serviço
export const updateOrderServiceAsync = async (
  request: OrderServiceRequestDto
): Promise<{ data: OrderServiceResponseDto; status: number }> => {
  const response = await instanceApi.put<OrderServiceResponseDto>(
    "/OrderService",
    request
  );
  return {
    data: response.data,
    status: response.status,
  };
};

// Buscar por ID
export const getOrderServiceByIdAsync = async (
  id: string
): Promise<OrderServiceResponseDto | string> => {
  const response = await instanceApi.get<OrderServiceResponseDto | string>(
    `/OrderService/${id}`
  );
  return response.data;
};

// Buscar todos com filtros (GET com query)
export const getAllOrderServicesAsync = async (
  queryObj?: Partial<OrderServiceRequestDto>
): Promise<OrderServiceResponseDto[] | string> => {
  const query = new URLSearchParams();
  const keyMap: Record<string, string> = {
    clienteId: "ClienteId",
    funcionarioId: "FuncionarioId",
    status: "Status",
  };

  for (const key in queryObj) {
    const backendKey = keyMap[key] ?? key;
    const value = queryObj[key as keyof OrderServiceRequestDto];
    if (value !== undefined && value !== null && value !== "") {
      query.append(backendKey, value.toString());
    }
  }

  const response = await instanceApi.get<OrderServiceResponseDto[] | string>(
    `/OrderService${query.toString() ? "?" + query.toString() : ""}`
  );

  return response.data;
};

// Deletar ordem de serviço
export const deleteOrderServiceAsync = async (id: string): Promise<string> => {
  const response = await instanceApi.delete<string>(`/OrderService?id=${id}`);
  return response.data;
};

// Desativar ordem de serviço
export const desabilitarOrderServiceAsync = async (
  id: string
): Promise<OrderServiceResponseDto> => {
  const response = await instanceApi.put<OrderServiceResponseDto>(
    `/OrderService/DesativarPrestacao?id=${id}`
  );
  return response.data;
};

// Alterar status da ordem de serviço
export const alterarStatusOrderServiceAsync = async (
  id: string,
  status: EOrderServiceStatus
): Promise<boolean> => {
  const response = await instanceApi.put<boolean>(
    `/OrderService/AlterarStatus?id=${id}&status=${status}`
  );
  return response.data;
};

// Buscar por status
export const getOrderServicesByStatusAsync = async (
  statusList: EOrderServiceStatus[]
): Promise<OrderServiceResponseDto[]> => {
  const params = statusList.map(s => `statusPrestacao=${s}`).join("&");
  const response = await instanceApi.get<OrderServiceResponseDto[]>(
    `/OrderService/GetByStatus?${params}`
  );
  return response.data;
};

// Buscar todos (sem filtro)
export const getAllSimpleOrderServicesAsync = async (): Promise<
  OrderServiceResponseDto[]
> => {
  const response = await instanceApi.get<OrderServiceResponseDto[]>(
    "/OrderService/GetAll"
  );
  return response.data;
};
