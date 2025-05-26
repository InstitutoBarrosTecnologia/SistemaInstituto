import { BaseResponseDto } from "./BaseResponseDto";


export interface BranchOfficeResponseDto extends BaseResponseDto {
    nomeFilial: string;
    observacao: string;
    endereco: {
        rua: string;
        cep: string;
        numero: string;
    };
    matriz: boolean;
    idGerenteFilial?: string;
    nomeGerente: string;
}
