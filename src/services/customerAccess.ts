/**
 * TEMPORÁRIO - Sistema de acesso automático para clientes
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */

// Exports de Services
export { 
    getCustomersWithoutAccessAsync,
    generateSingleAccessAsync,
    generateBatchAccessAsync,
    checkAccessByCpfAsync
} from './service/CustomerAccessService';

// Exports de DTOs - Request
export type { 
    GenerateCustomerAccessBatchDto
} from './model/Dto/Request/CustomerAccessRequestDto';

// Exports de DTOs - Response
export type { 
    CustomerAccessResultDto,
    CustomerAccessResponseDto
} from './model/Dto/Response/CustomerAccessResponseDto';
