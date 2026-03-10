import { BaseRequestDto } from "./BaseRequestDto";
import { ETipoTransacao } from "../../Enum/ETipoTransacao";

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
}
