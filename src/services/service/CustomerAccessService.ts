/**
 * TEMPORÁRIO - Sistema de acesso automático para clientes
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */

import { CustomerAccessRequestDto, GenerateCustomerAccessBatchDto } from "../model/Dto/Request/CustomerAccessRequestDto";
import { CustomerAccessResponseDto, CustomerAccessResultDto } from "../model/Dto/Response/CustomerAccessResponseDto";
import { CustomerResponseDto } from "../model/Dto/Response/CustomerResponseDto";
import { instanceApi } from "./AxioService";

// GET - Buscar clientes sem acesso cadastrado
export const getCustomersWithoutAccessAsync = async (): Promise<CustomerResponseDto[]> => {
    const response = await instanceApi.get<CustomerResponseDto[]>(`/CustomerAccess/GetCustomersWithoutAccess`);
    return response.data;
};

// POST - Gerar acesso para um único cliente
export const generateSingleAccessAsync = async (
    request: CustomerAccessRequestDto
): Promise<CustomerAccessResultDto> => {
    const response = await instanceApi.post<CustomerAccessResultDto>(
        `/CustomerAccess/GenerateSingle`, 
        request
    );
    return response.data;
};

// POST - Gerar acessos em lote
export const generateBatchAccessAsync = async (
    request: GenerateCustomerAccessBatchDto
): Promise<CustomerAccessResponseDto> => {
    const response = await instanceApi.post<CustomerAccessResponseDto>(
        `/CustomerAccess/GenerateBatch`, 
        request
    );
    return response.data;
};

// GET - Verificar se CPF já tem acesso
export const checkAccessByCpfAsync = async (cpf: string): Promise<boolean> => {
    const response = await instanceApi.get<boolean>(`/CustomerAccess/CheckAccess/${cpf}`);
    return response.data;
};
