import { BaseResponseDto } from "./BaseResponseDto";
import { ETipoTransacao } from "../../Enum/ETipoTransacao";
import { EDespesaStatus } from "../../Enum/EDespesaStatus";
import { EStatusParcela } from "../../Enum/EStatusParcela";
import { EmployeeResponseDto } from "./EmployeeResponseDto";
import { CustomerResponseDto } from "./CustomerResponseDto";

export interface ParcelaResponseDto {
    id?: string;
    numero: number;
    valor: number;
    dataVencimento: string;
    status: EStatusParcela;
    dataPagamento?: string;
    transacaoId: string;
}

export interface FinancialTransactionResponseDto extends BaseResponseDto {
    nomeDespesa: string;
    descricao?: string;
    unidadeId: string;
    nomeUnidade: string;
    valores: number;
    tipo: ETipoTransacao;
    formaPagamento: string;
    conta: string;
    tipoDocumento?: string;
    status: EDespesaStatus;
    dataAtualizacao?: string;
    arquivo?: string;
    observacoes?: string;
    numeroParcelas: number;
    dataVencimento: string;
    parcelas: ParcelaResponseDto[];
    usrCadastro?: string;
    usrDescricaoCadastro?: string;
    funcionario?: EmployeeResponseDto;
    cliente?: CustomerResponseDto;
}
