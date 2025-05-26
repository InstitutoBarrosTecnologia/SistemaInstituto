import { BaseRequestDto } from "./BaseRequestDto";

export interface BranchOfficeRequestDto extends BaseRequestDto {
    nomeFilial: string;
    observacao: string;
    endereco: {
        rua: string;
        cep: string;
        numero: string;
    };
    matriz: boolean;
    idGerenteFilial?: string;
}
