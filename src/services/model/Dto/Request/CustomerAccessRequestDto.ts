/**
 * TEMPORÁRIO - Sistema de acesso automático para clientes
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */

export interface CustomerAccessRequestDto {
    customerId: string;
}

export interface GenerateCustomerAccessBatchDto {
    customerIds?: string[];
}
