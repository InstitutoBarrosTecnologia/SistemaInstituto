import { CustomerRequestDto } from "../model/Dto/Request/CustomerRequestDto";
import { CustomerResponseDto } from "../model/Dto/Response/CustomerResponseDto";
import { instanceApi } from "./AxioService";


// GET - Buscar cliente por e-mail ou ID
export const getCustomerAsync = async (email?: string, id?: string): Promise<CustomerResponseDto | string> => {
    const query = email ? `?email=${email}` : `?id=${id}`;
    const response = await instanceApi.get<CustomerResponseDto | string>(`/Customer/SearchCustomer${query}`);
    return response.data;
};

// GET - Buscar cliente por e-mail (validação)
export const getCustomerEmailAsync = async (email: string): Promise<CustomerResponseDto | null> => {
    const response = await instanceApi.get<CustomerResponseDto | null>(`/Customer/GetCustomerEmail?email=${email}`);
    return response.data;
};

// GET - Buscar cliente por ID
export const getCustomerIdAsync = async (id: string): Promise<CustomerResponseDto | null> => {
    const response = await instanceApi.get<CustomerResponseDto | null>(`/Customer/GetCustomerId?id=${id}`);
    return response.data;
};

// GET - Listar todos os clientes
export const getAllCustomersAsync = async (): Promise<CustomerResponseDto[] | null> => {
    const response = await instanceApi.get<CustomerResponseDto[] | null>(`/Customer/GetAllCustomer`);
    return response.data;
};

// POST - Cadastrar novo cliente
export const postCustomerAsync = async (
    request: CustomerRequestDto
): Promise<{ status: number }> => {
    const response = await instanceApi.post(`/Customer/RegisterCustomer`, request);
    return { status: response.status };
};

// PUT - Atualizar cliente
export const putCustomerAsync = async (
    request: CustomerRequestDto
): Promise<{ status: number }> => {
    const response = await instanceApi.put(`/Customer/UpdateCustomer`, request);
    return { status: response.status };
};

// DELETE - Excluir cliente por ID
export const deleteCustomerAsync = async (id: string): Promise<{ status: number }> => {
    const response = await instanceApi.delete(`/Customer/DeleteCustomerId?id=${id}`);
    return { status: response.status };
};

// PUT - Desabilitar cliente por ID
export const disableCustomerAsync = async (id: string): Promise<{ status: number }> => {
    const response = await instanceApi.put(`/Customer/DesableCustomer/${id}`);
    return { status: response.status };
};