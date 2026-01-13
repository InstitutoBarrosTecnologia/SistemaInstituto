/**
 * TEMPORÁRIO - Sistema de acesso automático para clientes
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */

export interface CustomerAccessResultDto {
    customerId: string;
    customerName?: string;
    cpf?: string;
    username?: string;
    password?: string;
    success: boolean;
    errorMessage?: string;
}

export interface CustomerAccessResponseDto {
    totalProcessed: number;
    successCount: number;
    failedCount: number;
    results: CustomerAccessResultDto[];
}
