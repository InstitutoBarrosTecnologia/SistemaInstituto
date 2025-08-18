// Exports de Services
export { FinancialTransactionService } from './service/FinancialTransactionService';

// Exports de DTOs - Request
export type { FinancialTransactionRequestDto } from './model/Dto/Request/FinancialTransactionRequestDto';
export type { UpdateStatusRequestDto } from './model/Dto/Request/UpdateStatusRequestDto';

// Exports de DTOs - Response
export type { FinancialTransactionResponseDto, ParcelaResponseDto } from './model/Dto/Response/FinancialTransactionResponseDto';

// Exports de Enums
export { ETipoTransacao, getTipoTransacaoLabel } from './model/Enum/ETipoTransacao';
export { EDespesaStatus, getDespesaStatusLabel } from './model/Enum/EDespesaStatus';
export { EStatusParcela, getStatusParcelaLabel } from './model/Enum/EStatusParcela';

// Exports de Utils
export { FinancialTransactionUtils } from './util/FinancialTransactionUtils';

// Exports de Types para conveniência
export type { TransactionFilters } from './service/FinancialTransactionService';
