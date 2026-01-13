/**
 * TEMPORÁRIO - Sistema de acesso automático para clientes
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */

import { GenerateCustomerAccessBatchDto } from "../model/Dto/Request/CustomerAccessRequestDto";
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
    customerId: string
): Promise<CustomerAccessResultDto> => {
    // Backend espera apenas o Guid como string no body
    const response = await instanceApi.post<CustomerAccessResultDto>(
        `/CustomerAccess/GenerateSingle`, 
        `"${customerId}"`, // Enviar como string JSON
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
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
