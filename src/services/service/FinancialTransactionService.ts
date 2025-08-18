import { instanceApi } from "./AxioService";
import { FinancialTransactionRequestDto } from "../model/Dto/Request/FinancialTransactionRequestDto";
import { UpdateStatusRequestDto } from "../model/Dto/Request/UpdateStatusRequestDto";
import { UpdateInstallmentsStatusRequestDto } from "../model/Dto/Request/UpdateInstallmentsStatusRequestDto";
import { FinancialTransactionResponseDto } from "../model/Dto/Response/FinancialTransactionResponseDto";
import { ETipoTransacao } from "../model/Enum/ETipoTransacao";
import { EDespesaStatus } from "../model/Enum/EDespesaStatus";

export interface TransactionFilters {
    unidadeId?: string;
    tipo?: ETipoTransacao;
    status?: EDespesaStatus;
    dataInicio?: string;
    dataFim?: string;
}

export const FinancialTransactionService = {
    /**
     * Criar uma nova transação financeira
     */
    async create(data: FinancialTransactionRequestDto): Promise<FinancialTransactionResponseDto> {
        try {
            const response = await instanceApi.post<FinancialTransactionResponseDto>("/transactions", data);
            return response.data;
        } catch (error: any) {
            // Propagar o erro original para que o componente possa tratá-lo adequadamente
            throw error;
        }
    },

    /**
     * Listar todas as transações com filtros opcionais
     */
    async getAll(filters?: TransactionFilters): Promise<FinancialTransactionResponseDto[]> {
        try {
            const params = new URLSearchParams();
            
            if (filters?.unidadeId) {
                params.append('unidadeId', filters.unidadeId);
            }
            if (filters?.tipo !== undefined) {
                params.append('tipo', filters.tipo.toString());
            }
            if (filters?.status !== undefined) {
                params.append('status', filters.status.toString());
            }
            if (filters?.dataInicio) {
                params.append('dataInicio', filters.dataInicio);
            }
            if (filters?.dataFim) {
                params.append('dataFim', filters.dataFim);
            }

            const queryString = params.toString();
            const url = queryString ? `/transactions?${queryString}` : '/transactions';
            
            const response = await instanceApi.get<FinancialTransactionResponseDto[]>(url);
            return response.data || [];
        } catch (error: any) {
            if (error.response?.status === 204) {
                return []; // No Content - retorna array vazio
            }
            throw new Error("Erro ao buscar transações financeiras");
        }
    },

    /**
     * Buscar transação por ID
     */
    async getById(id: string): Promise<FinancialTransactionResponseDto> {
        try {
            const response = await instanceApi.get<FinancialTransactionResponseDto>(`/transactions/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 204) {
                throw new Error("Transação não encontrada");
            }
            throw new Error("Erro ao buscar transação financeira");
        }
    },

    /**
     * Atualizar uma transação
     */
    async update(id: string, data: FinancialTransactionRequestDto): Promise<FinancialTransactionResponseDto> {
        try {
            const response = await instanceApi.put<FinancialTransactionResponseDto>(`/transactions/${id}`, data);
            return response.data;
        } catch (error: any) {
            // Propagar o erro original para que o componente possa tratá-lo adequadamente
            throw error;
        }
    },

    /**
     * Atualizar status de uma transação
     */
    async updateStatus(id: string, data: UpdateStatusRequestDto): Promise<FinancialTransactionResponseDto> {
        try {
            const response = await instanceApi.put<FinancialTransactionResponseDto>(`/transactions/${id}/status`, data);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 204) {
                throw new Error("Transação não encontrada");
            }
            throw new Error("Erro ao atualizar status da transação");
        }
    },

    /**
     * Excluir uma transação
     */
    async delete(id: string): Promise<void> {
        try {
            await instanceApi.delete(`/transactions/${id}`);
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data || "Erro de validação");
            }
            throw new Error("Erro ao excluir transação financeira");
        }
    },

    /**
     * Atualizar status de uma parcela
     */
    async updateParcelaStatus(transacaoId: string, numeroParcela: number, data: UpdateInstallmentsStatusRequestDto): Promise<void> {
        try {
            await instanceApi.put(`/Installments/transacao/${transacaoId}/parcela/${numeroParcela}/status`, data);
        } catch (error: any) {
            throw error;
        }
    }
};
