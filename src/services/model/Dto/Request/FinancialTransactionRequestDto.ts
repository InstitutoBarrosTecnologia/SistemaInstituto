import { BaseRequestDto } from "./BaseRequestDto";
import { ETipoTransacao } from "../../Enum/ETipoTransacao";
import { EDespesaStatus } from "../../Enum/EDespesaStatus";

export interface FinancialTransactionRequestDto extends BaseRequestDto {
    nomeDespesa: string;
    descricao?: string;
    filialId?: string;
    valores: number;
    tipo: ETipoTransacao;
    formaPagamento: string;
    conta: string;
    tipoDocumento?: string;
    arquivo?: string;
    observacoes?: string;
    numeroParcelas?: number;
    numberOfInstallments?: number; // Additional property for number of installments
    dataVencimento: string;
    ordemServicoId?: string;
    usrDescricaoCadastro?: string;
    usrCadastro?: string;
    dataCadastro?: string;
    status?: EDespesaStatus; // Status da transação (Pendente=1, Aprovada=2, Cancelada=3, Concluida=4)
}
